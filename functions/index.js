functions = require("firebase-functions");
admin = require("firebase-admin");
cors = require("cors")({ Origin: true });
sha256 = require("crypto-js/sha256");
requestModule = require("request");
mailgun = require("mailgun-js")({
  apiKey: "3aa7951d54ec66a24a867e774435cd79-52cbfb43-f31e1bb7",
  domain: "sandbox4d4597425379442aa550284e88d9c657.mailgun.org",
});

admin.initializeApp();
const db = admin.firestore();

// epayco NOT IN USE
/* exports.receivePaymentStatus = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, () => {
      console.log("Updating");
    });
    const state = request.body.x_cod_response;
    console.log("Estado Transaccion :" + state);
    if (state === "1") {
      const orderID = request.body.x_id_invoice;
      const userID = request.body.x_extra1;
      const currency = request.body.x_currency_code;
      const value = request.body.x_amount_ok;
      //const transactionDate = request.body.x_transaction_date;
      const transactionDate = new Date().getTime();

      const fsAdmin = admin.firestore();
      await fsAdmin
        .collection("transactions")
        .add({
          user: userID,
          order: orderID,
          currency: currency,
          value: value,
          date: transactionDate,
        })
        .catch((error) => {
          console.log(error);
          return 1;
        });

      const docRef1 = fsAdmin.collection("pendingPayment").doc(orderID);
      const docRef2 = fsAdmin.collection("pendingClaim").doc(orderID);

      const doc = await docRef1.get();

      try {
        const updated = await docRef2.set({
          ...doc.data(),
          paymentDate: transactionDate,
        });
        if (updated) {
          try {
            await docRef1.delete();
            response.end();
          } catch (error2) {
            console.log(error2);
          }
        }
      } catch (error) {
        console.log(error1);
      }
    }
    response.end();
  }
); */

exports.pseTransactionAttempt = functions.firestore
  .document("pseTransactionAttempt/{transactionID}")
  .onWrite((change, context) => {
    let oldToken = "";
    if (change.before.exists) {
      oldToken = change.before.data().token;
    }

    const newToken = change.after.data().token;

    if (!change.before.exists || oldToken !== newToken) {
      pseObject = change.after.data();
      delete pseObject.creationDate;
      const requestOptions = {
        method: "POST",
        url: "https://api-uat.kushkipagos.com/transfer/v1/init",
        headers: {
          "private-merchant-id": "cc4f06cfa7b44ca68ef248a7a8296252",
          "content-type": "application/json",
        },
        body: {
          token: pseObject.token,
          amount: pseObject.amount,
          metadata: pseObject.metadata,
        },
        json: true,
      };

      requestModule(requestOptions, (error, response, body) => {
        if (error) throw new Error(error);
        return change.after.ref.set({ ...change.after.data(), ...body });
      });
    }
  });

exports.homeworkRated = functions.firestore
  .document("completed/{orderID}")
  .onUpdate(async (change, context) => {
    const previousValue = change.before.data();
    const newValue = change.after.data();

    const currentRating = newValue.rating;
    const provID = newValue.providerID;

    if (
      typeof currentRating === "undefined" ||
      !currentRating ||
      (typeof previousValue.rating !== "undefined" &&
        previousValue.rating === currentRating)
    )
      return;

    const fsAdmin = admin.firestore();
    const provRef = fsAdmin.collection("users").doc(provID);

    const userDoc = await provRef.get();
    const userData = userDoc.data();
    console.log("Numero de trabajos " + userData.ratedJobs);
    console.log("Rating del provedor " + userData.rating);

    // Checks for the number of rated jobs and assigns 0 if there is none
    let numJobs =
      typeof userData.ratedJobs !== "undefined" ? userData.ratedJobs : 0;

    if (typeof previousValue.rating === "undefined" || !previousValue.rating) {
      numJobs += 1;
    }

    console.log("Numero de trabajos contando el nuevo " + numJobs);

    // Checks the old rating of the provider and assigns the current rating is there is none
    let oldUserRating =
      typeof userData.rating !== "undefined" ? userData.rating : currentRating;

    const tempOld = oldUserRating;

    console.log("Rating anterior " + oldUserRating);

    if (typeof previousValue.rating !== "undefined") {
      oldUserRating =
        (oldUserRating * numJobs - previousValue.rating) / (numJobs - 1);
    }

    console.log("Rating con la modificación " + oldUserRating);

    const newJobNum = tempOld === oldUserRating ? numJobs - 1 : numJobs;

    const newUserRating =
      numJobs > 1
        ? (oldUserRating * (numJobs - 1) + currentRating) / numJobs
        : currentRating;

    console.log("Nuevo rating calculado " + newUserRating);

    try {
      const updated = await provRef.set({
        ...userData,
        rating: newUserRating.toFixed(2),
        ratedJobs: numJobs,
      });
    } catch (error) {
      console.log(error1);
    }
  });

//Mailing//

const domainName = "Tareas2Go";
const adminEmail = "sj.hnandez@gmail.com";
const fromAddress = domainName + "<noreply@" + domainName + ".com>";
const domainAddress = '"https://www.tareas2go.com/"';

const msgToHtml = (message) => {
  return (
    //styles
    "<html><head> <style>" +
    '*{margin: 0; padding: 0; font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px;}' +
    "html{margin: auto;}" +
    /*  "h1{padding: 10px; display: block; background: #2277E2; color: white; text-align: center; text-transform: uppercase; border-radius: 10px 10px 0px 0px;}" + */
    "a{display: block; width: 40%; margin: auto; padding: 10px; text-decoration: none; font-weight: bold; text-align: center; margin-top: 20px; margin-bottom: 20px;}" +
    "p{margin: 20px; text-align: center;}" +
    "img{display: block; width: 150px; margin-right: auto; margin-left:auto;}" +
    "body{width: 60%; margin: auto;}" +
    ".header-container{padding: 30px; display: block; background: #2277E2; border-radius: 10px 10px 0px 0px;}" +
    ".msg-container{width: 60%; margin: auto; border: 1px solid #e9e9e9; border-radius: 10px;}" +
    ".footer-container{margin: auto; text-align: center; color: #999; margin-top: 20px;}" +
    ".footer-container a{display: inline; background: transparent; color: #999; font-size: 12px;}" +
    ".footer-container span{display: block; font-size: 12px;}" +
    "@media screen and (max-width:768px){.msg-container{width: 90%;}}</style></head>" +
    //content
    "<body>" +
    "<div class='msg-container'>" +
    '<div class="header-container">' +
    '<img src="https://firebasestorage.googleapis.com/v0/b/tareas2-fbd79.appspot.com/o/assets%2FLogo_White.png?alt=media&token=70d319cf-ffb9-49f7-8c0b-75f5b1f35f95">' +
    "</div>" +
    message +
    "</div>" +
    '<div class="footer-container"><a href=' +
    domainAddress +
    ">" +
    domainName +
    '</a><span>Siguenos en: <a href="https://facebook.com">Facebook</a> <a href="https://instagram.com">Instagram</a></span><span>Todos los derechos reservados.</span></div></body></html>'
  );
};

const generateMail = (type, userData, info) => {
  let mail;
  switch (type) {
    case "support":
      mail = {
        user: {
          subject: "Confirmación de soporte",
          html: msgToHtml(
            "<p><b>¡Hola!</b></p><p>Tu ticket de soporte ha sido recibido. Nos pondremos en contacto contigo lo más pronto posible.</p>"
          ),
        },
        admin: {
          subject: "Nuevo ticket de soporte",
          html: msgToHtml(
            "</p><p><b>Nombre del usuario: </b>" +
              userData.name +
              "</p><p><b>email: </b>" +
              userData.email +
              "</p><p><b>Asunto: </b>" +
              info.subject +
              (() => {
                let ret = "";
                if (info.orderID && info.orderID.length > 0)
                  ret = "</p><p><b>ID de la orden: </b>" + info.orderID;
                return ret;
              })() +
              "</p><p><b>Descripción: </b></p><p>" +
              info.description +
              "</p>"
          ),
        },
      };
      break;

    case "new payment":
      mail = {
        user: {
          subject: "Gracias por tu pedido",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Ya puedes relajarte - tu pedido ha sido confirmado y uno de nuestros especialistas se encargará de tu tarea. " +
              "Recibirás un correo electrónico en cuanto la persona asignada complete la entrega del trabajo.</p>" +
              "<p>¡Gracias por confiar en Tareas2Go!</p>"
          ),
        },
        provider: {
          subject: "Nueva tarea disponible",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Te informamos que una nueva tarea en el campo de " +
              info.class +
              " se encuentra disponible. Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
        admin: {
          subject: "Una nueva tarea ha sido pagada",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Te informamos que se acaba de recibir pago por una nueva orden. Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
      };
      break;

    case "payment reminder":
      mail = {
        user: {
          subject: "Recordatorio de pago",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Te recordamos que todavía puedes realizar el pago de tus tareas desde tu panel de órdenes de Tareas2Go. Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
      };
      break;

    case "file uploaded":
      mail = {
        admin: {
          subject: "Nueva archivo entregado",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Te informamos que un proveedor acaba de entregar un archivo en la orden " +
              info.orderID +
              ". Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
      };
      break;

    case "order completed":
      mail = {
        user: {
          subject: "Tu orden ha sido completada",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Te informamos que tu orden con código " +
              info.orderID +
              " ha sido completada. Recuerda que puedes revisar y calificar la entrega <a href=" +
              domainAddress +
              ">en tu panel de órdenes.</a></p>"
          ),
        },
      };
      break;

    case "new message":
      mail = {
        user: {
          subject: "Has recibido un nuevo mensaje",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Tienes un mensaje nuevo de tu proveedor, te invitamos a que lo atiendas lo más pronto posible. Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
        provider: {
          subject: "Has recibido un nuevo mensaje",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Tienes un mensaje nuevo de un usuario, te invitamos a que lo atiendas lo más pronto posible. Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
      };
      break;

    case "order assigned":
      mail = {
        provider: {
          subject: "Se te ha asignado una nueva tarea",
          html: msgToHtml(
            "<p>¡Hola, " +
              userData.name +
              "! Te informamos que la tarea con código " +
              info.orderID +
              " se te ha sido asignada exitósamente. Para ver más detalles, <a href=" +
              domainAddress +
              ">haz clic aquí.</a></p>"
          ),
        },
      };
      break;

    default:
      return;
  }
  return mail;
};

exports.sendSupportEmail = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST");
    const [userData, info] = [
      JSON.parse(request.body).user,
      JSON.parse(request.body).info,
    ];
    const template = generateMail("support", userData, info);
    const userMail = {
      from: fromAddress,
      to: userData.email,
      subject: template.user.subject,
      html: template.user.html,
    };
    const adminMail = {
      from: fromAddress,
      to: adminEmail,
      subject: template.admin.subject,
      html: template.admin.html,
    };
    mailgun.messages().send(userMail);
    mailgun.messages().send(adminMail);
    console.log("mail sent");
    response.send();
    response.end();
  }
);

exports.sendPaymentEmail = functions.firestore
  .document("pendingClaim/{doc}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const user = await db.collection("users").doc(orderData.user).get();
    const userData = user.data();
    let template = generateMail("new payment", userData, orderData);
    mailgun.messages().send({
      from: fromAddress,
      to: userData.email,
      subject: template.user.subject,
      html: template.user.html,
    });
    await db
      .collection("users")
      .where("isProvider", "==", true)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
          if (
            doc.data().specialty &&
            doc.data().specialty.includes(orderData.class)
          ) {
            template = generateMail("new payment", doc.data(), orderData);
            mailgun.messages().send({
              from: fromAddress,
              to: doc.data().email,
              subject: template.provider.subject,
              html: template.provider.html,
            });
          }
        });
      });
    await db
      .collection("users")
      .where("isAdmin", "==", true)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
          template = generateMail("new payment", doc.data(), orderData);
          mailgun.messages().send({
            from: fromAddress,
            to: doc.data().email,
            subject: template.admin.subject,
            html: template.admin.html,
          });
        });
      });
  });

exports.sendPaymentReminder = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    await db
      .collection("pendingPayment")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if (!doc.data().reminderSent) {
            console.log("reminder not sent");
            if (
              Math.floor(
                (new Date().getTime() - Number(doc.data().createdAt)) /
                  (60 * 60 * 1000)
              ) >= 24
            ) {
              console.log("sending reminder");
              await db
                .collection("pendingPayment")
                .doc(doc.id)
                .update({ reminderSent: true });
              const user = await db
                .collection("users")
                .doc(doc.data().user)
                .get();
              const userData = user.data();
              const template = generateMail(
                "payment reminder",
                userData,
                doc.data()
              );
              mailgun.messages().send({
                from: fromAddress,
                to: userData.email,
                subject: template.user.subject,
                html: template.user.html,
              });
            }
          }
        });
        return;
      });
  });

exports.sendOrderCompletedEmail = functions.firestore
  .document("completed/{doc}")
  .onCreate(async (snap, context) => {
    const orderData = { ...snap.data(), orderID: snap.id };
    const user = await db.collection("users").doc(orderData.user).get();
    const userData = user.data();
    let template = generateMail("order completed", userData, orderData);
    mailgun.messages().send({
      from: fromAddress,
      to: userData.email,
      subject: template.user.subject,
      html: template.user.html,
    });
  });

exports.sendNewOrderMessageEmail = functions.firestore
  .document("orderMessages/{orderID}/{messageCollectionID}/{messageID}")
  .onCreate(async (snap, context) => {
    if (context.params.messageCollectionID === "messages") {
      const messageData = snap.data();
      const prevSnapshot = await db
        .collection("orderMessages/" + context.params.orderID + "/messages")
        .orderBy("sendTime", "desc")
        .where("sendTime", "<", messageData.sendTime)
        .limit(1)
        .get();
      if (!prevSnapshot.empty) {
        const prevData = prevSnapshot.docs[0].data();
        if (
          Math.floor(Number(messageData.sendTime) - Number(prevData.sendTime)) /
            (60 * 1000) >
          30
        ) {
          const convo = await db
            .collection("orderMessages")
            .doc(context.params.orderID)
            .get();
          const convoData = convo.data();
          let receiverID;
          let role;
          if (messageData.senderID === convoData.userID) {
            receiverID = convoData.providerID;
            role = "provider";
          } else {
            receiverID = convoData.userID;
            role = "user";
          }
          const user = await db.collection("users").doc(receiverID).get();
          const userData = user.data();
          const template = generateMail("new message", userData, {});
          mailgun.messages().send({
            from: fromAddress,
            to: userData.email,
            subject: template[role].subject,
            html: template[role].html,
          });
        }
      }
    }
  });

exports.sendOrderAssignedEmail = functions.firestore
  .document("inProcess/{doc}")
  .onCreate(async (snap, context) => {
    const orderData = { ...snap.data(), orderID: snap.id };
    const user = await db.collection("users").doc(orderData.providerID).get();
    const userData = user.data();
    let template = generateMail("order assigned", userData, orderData);
    mailgun.messages().send({
      from: fromAddress,
      to: userData.email,
      subject: template.provider.subject,
      html: template.provider.html,
    });
  });
