// Script de seed MongoDB pour NexTalk (à lancer dans mongosh ou via docker exec)
// Utilisateurs de test : admin/toto, user/toto
// Conférences de démo variées

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const users = [
  {
    _id: { $oid: "69a005b0491cef002d3ca1b2" },
    id: "admin",
    password: "$2y$10$QDheuIT1XvYSlv/eW0Cqv.EdlBQQBJl5DJlyl3M9666ffGCIAR1Hi",
    type: "admin",
    __v: 0,
  },
  {
    _id: { $oid: "69a03f2ba981a8001a0a2e30" },
    id: "user",
    password: "$2a$10$iX0vOBCXCTOrP4WS.p8T1OPIX614LEXJJ/Q38DFUbk.EcXpaHj.sS",
    type: "user",
    __v: 0,
  },
];

const conferences = [
  {
    _id: { $oid: "69a00c0351cf570b3d8563b1" },
    id: "conf-1",
    title: "Introduction a React",
    date: "2026-03-10",
    description: "Les bases de React : composants, etat et props.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/440px-React-icon.svg.png",
    content:
      "Nous aborderons les fondamentaux de React : creation de composants fonctionnels, gestion du state avec useState, communication entre composants via les props.",
    duration: "3h",
    speakers: [
      {
        _id: { $oid: "69a0281a491cef002d3ca34f" },
        firstname: "Alice",
        lastname: "Martin",
      },
    ],
    stakeholders: [],
    design: { mainColor: "#282c34", secondColor: "#61dafb" },
    osMap: { coordinates: [] },
  },
  {
    _id: { $oid: "69a00c0351cf570b3d8563b2" },
    id: "conf-2",
    title: "Node.js et API REST",
    date: "2026-03-17",
    description: "Concevoir et deployer une API REST avec Express.",
    img: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    content:
      "De la conception des routes REST a la connexion MongoDB avec Mongoose, validation des donnees et gestion des erreurs HTTP.",
    duration: "4h",
    speakers: [
      {
        _id: { $oid: "69a02bf3491cef002d3ca374" },
        firstname: "Bob",
        lastname: "Dupont",
      },
      {
        _id: { $oid: "69a02bf3491cef002d3ca375" },
        firstname: "Claire",
        lastname: "Renaud",
      },
    ],
    stakeholders: [
      {
        _id: { $oid: "69a02bf3491cef002d3ca373" },
        firstname: "David",
        lastname: "Le Blanc",
      },
    ],
    design: { mainColor: "#1a4731", secondColor: "#68d391" },
    osMap: { coordinates: [] },
  },
  {
    _id: { $oid: "69a00c0351cf570b3d8563b3" },
    id: "conf-3",
    title: "Securite Web : OWASP Top 10",
    date: "2026-04-02",
    description:
      "Tour des 10 principales vulnerabilites web et comment s en premunir.",
    img: "https://owasp.org/www-project-top-ten/assets/images/Top10-logo.png",
    content:
      "XSS, CSRF, injections SQL. Nous analyserons chaque categorie de l OWASP Top 10 avec des exemples concrets et des contre-mesures pratiques.",
    duration: "2h30",
    speakers: [{ firstname: "Eve", lastname: "Bernard" }],
    stakeholders: [],
    design: { mainColor: "#1e1b4b", secondColor: "#a5b4fc" },
  },
];

await db.collection("conferences").insertMany(conferences);

// Exécution directe (node mongo-seed.js) ou via mongosh
if (require.main === module) {
  const { MongoClient } = require("mongodb");
  async function main() {
    try {
      const client = await MongoClient.connect("mongodb://localhost:27017");
      const db = client.db("cyberconf");
      await seed(db);
      await client.close();
    } catch (err) {
      console.error(err);
    }
  }

  await main();
}

module.exports = seed;
