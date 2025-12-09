// // =========================
// //  SEED COMPLET VOLUNTEERNOW
// // =========================
// require('./config/connection');
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// require("dotenv").config();

// // Import des modèles
// const User = require("./models/user");
// const Evenement = require("./models/evenement");
// const Candidature = require("./models/candidature");
// const Badge = require("./models/badge");
// const UserBadge = require("./models/userBadges");

// // Connexion MongoDB
// //mongoose.connect(process.env.MONGO_URI)
//   //.then(() => console.log("📌 MongoDB connecté"))
//   //.catch(err => console.error("❌ Erreur :", err));

// async function hashPassword(password) {
//   return await bcrypt.hash(password, 10);
// }

// async function seed() {
//   try {
//     console.log("🧹 Suppression anciennes données...");
//     await User.deleteMany({});
//     await Evenement.deleteMany({});
//     await Candidature.deleteMany({});
//     await Badge.deleteMany({});
//     await UserBadge.deleteMany({});

//     // --------------------------------------------
//     // 1️⃣ BADGES
//     // --------------------------------------------
//     console.log("🏅 Insertion badges...");

//     const badges = await Badge.insertMany([
//       { niveau: "Bronze", description: "5 participations", icon: "🥉" },
//       { niveau: "Argent", description: "15 participations", icon: "🥈" },
//       { niveau: "Or", description: "20 participations + 3 villes", icon: "🥇" },
//       { niveau: "Platine", description: "30 participations + 5 villes", icon: "💎" }
//     ]);

//     // --------------------------------------------
//     // 2️⃣ UTILISATEURS COMPLETS
//     // --------------------------------------------
//     console.log("👤 Insertion utilisateurs...");

//     const allUsers = [];

//     // ➤ 10 BÉNÉVOLES COMPLETS
//     for (let i = 1; i <= 10; i++) {
//       allUsers.push({
//         name: `Benevole ${i}`,
//         email: `benevole${i}@test.com`,
//         password: await hashPassword("123456"),
//         role: "benevole",
//         ville: "Tunis",
//         phone: "22123456",
//         photo: "uploads/users/default-user.png",
//         bio: `Je suis bénévole ${i}`,
//         categories: "Environnement, Social"
//       });
//     }

//     // ➤ 5 ORGANISATIONS COMPLETES
//     for (let i = 1; i <= 5; i++) {
//       allUsers.push({
//         name: `Organisation ${i}`,
//         email: `orga${i}@test.com`,
//         password: await hashPassword("123456"),
//         role: "organisation",
//         ville: "Ariana",
//         phone: "99887766",
//         photo: "uploads/users/default-user.png",
//         bio: `Nous sommes l'organisation ${i}`,
//         categories: "Humanitaire",
//         organisation_infos: {
//           contact: "contact@test.com",
//           description: `Description organisation ${i}`
//         }
//       });
//     }

//     const users = await User.insertMany(allUsers);

//     const benevoles = users.filter(u => u.role === "benevole");
//     const organisations = users.filter(u => u.role === "organisation");

//     // --------------------------------------------
//     // 3️⃣ 30 ÉVÉNEMENTS COMPLETS
//     // --------------------------------------------
//     console.log("📅 Insertion événements...");

//     const villes = ["Tunis", "Ariana", "Nabeul", "Sousse", "Ben Arous"];

//     const events = [];

//     for (let i = 0; i < 30; i++) {
//       events.push({
//         organisation_id: organisations[i % organisations.length]._id,
//         titre: `Événement ${i + 1}`,
//         description: "Événement test complet",
//         date_event: new Date(),
//         localisation: `${villes[i % 5]} - Rue principale`,
//         position: {
//           latitude: 36.8 + i * 0.005,
//           longitude: 10.1 + i * 0.005
//         },
//         categorie: "Environnement",
//         nb_places: 25 + (i % 10),
//         statut: "Ouvert"
//       });
//     }

//     const allEvents = await Evenement.insertMany(events);

//     // --------------------------------------------
//     // 4️⃣ CANDIDATURES COMPLETES + BADGES
//     // --------------------------------------------
//     console.log("📨 Insertion candidatures...");

//     for (const benevole of benevoles) {
//       const randomEvents = allEvents.sort(() => 0.5 - Math.random()).slice(0, 10);

//       for (const ev of randomEvents) {
//         await Candidature.create({
//           user_id: benevole._id,
//           event_id: ev._id,
//           statut: "Acceptée"
//         });
//       }

      
//     }

//     console.log("✅ SEED TERMINÉ AVEC SUCCÈS !");
//     mongoose.connection.close();

//   } catch (err) {
//     console.error("❌ Erreur SEED :", err);
//   }
// }

// seed();


require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/user");
const Evenement = require("./models/evenement");
const Candidature = require("./models/candidature");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌿 MongoDB connectée");

    await User.deleteMany({});
    await Evenement.deleteMany({});
    await Candidature.deleteMany({});
    console.log("🧹 Collections vidées");

    // === Organisation ===
    const organisation = await User.create({
      _id: "677def1234567890bbb22222",
      name: "Organisation Test",
      email: "orga@test.com",
      role: "organisation",
      password: "$2b$10$abcdefghijk1234567890HashedPassword"
    });

    // === Bénévole ===
    const benevole = await User.create({
      _id: "676abc1234567890aaa11111",
      name: "Karima Test",
      email: "karima@test.com",
      role: "benevole",
      password: "$2b$10$abcdefghijk1234567890HashedPassword"
    });

    console.log("👤 Utilisateurs créés");

    // === 5 Événements ===
    const events = [];

    for (let i = 1; i <= 5; i++) {
      const event = await Evenement.create({
        titre: `Événement Test ${i}`,
        organisation_id: organisation._id,
        description: "Test participation",
        date_event: new Date(`2026-02-${i + 10}`),
        localisation: `Tunis–${i}`,
        position: { latitude: 36.8 + i * 0.01, longitude: 10.18 + i * 0.01 },
        categorie: "Social",
        nb_places: 50,
        statut: "Ouvert"
      });

      events.push(event);
    }

    console.log("🎉 5 événements créés");

    // === 5 Candidatures (1 par événement) ===
    for (let ev of events) {
      await Candidature.create({
        user_id: benevole._id,
        event_id: ev._id,
        statut: "En attente"
      });
    }

    console.log("📝 5 candidatures créées");

    console.log("✅ SEED TERMINÉ AVEC SUCCÈS");
    process.exit();

  } catch (err) {
    console.error("❌ Erreur seed:", err);
    process.exit(1);
  }
})();
