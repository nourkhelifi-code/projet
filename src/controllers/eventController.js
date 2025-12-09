const mongoose = require('mongoose');
const { Types } = mongoose;

// eventController.js
const Evenement = require('../models/evenement');
const User = require('../models/user');
const Badge = require('../models/badge');
const UserBadge = require('../models/userBadges');

// Récupérer un événement par son ID
exports.getEventById = async (req, res) => {
    try {
        const id = req.params.id;

        const event = await Evenement.findById(id)
            .populate("organisation_id", "name email phone ville photo organisation_infos")
            .exec();

        if (!event) {
            return res.status(404).json({ message: "Événement introuvable" });
        }

        res.json(event);

    } catch (err) {
        console.error("Erreur getEventById:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les positions (latitude/longitude) de tous les événements
exports.getEventsPositions = async (req, res) => {
    try {
        const events = await Evenement.find({}, {
            _id: 1,
            titre: 1,
            localisation: 1,
            position: 1
        });

        res.json(events);

    } catch (err) {
        console.error("Erreur getEventsPositions:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Créer un événement (seuls les organismes peuvent créer)
// exports.createEvent = async (req, res) => {
//     console.log("REQ.USER =", req.user);
//     try {
//         if (!req.user || req.user.role !== "organisation") {
//             return res.status(403).json({ message: "Seuls les organismes peuvent créer un événement" });
//         }


//         // Transformer l'ID utilisateur en ObjectId
//         const userId = req.user.id;



//         // Créer l'événement
//         const event = new Evenement({
//             ...req.body,
//             organisation_id: req.user.id    
//         });

//         await event.save();

//         // Compter le nombre total d'événements de cet utilisateur
//         const count = await Evenement.countDocuments({ organisation_id: req.user.id});

//         // Définir les paliers de badges
//         const thresholds = [
//             { count: 10, niveau: "Bronze" },
//             { count: 15, niveau: "Argent" },
//             { count: 20, niveau: "Or" },
//             { count: 30, niveau: "Platine" },
//         ];

//        let badgesAwardedThisTime = []; // Liste des nouveaux badges attribués lors de cette création

//         for (let i = 0; i < thresholds.length; i++) {
//             if (count >= thresholds[i].count) {
//                 const badge = await Badge.findOne({ niveau: thresholds[i].niveau });
//                 if (!badge) continue;

//                 // Vérifier si le badge existe déjà pour cet utilisateur
//                 const alreadyAwarded = await UserBadge.findOne({
//                     user_id: req.user.id,
//                     badge_id: badge._id
//                 });

//                 if (!alreadyAwarded) {
//                     // Attribuer le badge
//                     await UserBadge.create({
//                         user_id: req.user.id,
//                         badge_id: badge._id
//                     });
//                     badgesAwardedThisTime.push(thresholds[i].niveau);
//                 }
//             }
//         }
//         // Récupérer tous les badges de l'utilisateur après ajout éventuel
//         const allUserBadges = await UserBadge.find({ user_id: userId })
//             .populate("badge_id", "niveau"); // populate pour récupérer le niveau

//         const badgeNames = allUserBadges.map(ub => ub.badge_id.niveau);

//         res.status(201).json({
//             success: true,
//             message: `Événement ajouté avec succès ! Total = ${count}`,
//             badges: badgeNames.length > 0 ? badgeNames : null,
//             event
//         });

//     } catch (err) {
//         console.error("Erreur createEvent:", err);
//         res.status(500).json({ message: "Erreur serveur", error: err.message });
//     }
// };




// POST /events
exports.createEvenement = async (req, res) => {
  try {
    console.log("BODY RECU :", req.body);

    const organisationId = req.user?.id || "673a60c43a74ef29d8c03fd1";

    const {
      titre,
      description,
      date_event,
      localisation,
      ville, // utile si tu veux l’ajouter dans le modèle plus tard
      categorie,
      nb_places,
      latitude,
      longitude,
    } = req.body;

    const newEvent = new Evenement({
      organisation_id: organisationId,
      titre,
      description,
      date_event,
      localisation, // <-- propre
      position: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      categorie,
      nb_places,
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error("Erreur création événement :", err);
    res.status(500).json({ message: err.message });
  }
};





// Récupérer tous les événements
exports.getEvents = async (req, res) => {
    try {
        const events = await Evenement.find()
            .populate("organisation_id", "name organisation_infos");
        res.status(200).json(events);
    } catch (err) {
        console.error("Erreur getEvents:", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
