const User = require('../models/user');
const bcrypt = require("bcrypt")

exports.updateProfile = async (req,res) => {
    try {

        const userId = req.params.id;
        const { name, email, phone, ville, bio, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        /** 🔵 1. Mise à jour du NOM (Google & Local) **/
        if (name) user.name = name;

        /** 🔵 2. Mise à jour de la photo (Google & Local) **/
        if (req.file) {
            user.photo = `/uploads/users/${req.file.filename}`;
        }

        /** 🔥 3. Spécifique utilisateur LOCAL : vérif email, mdp **/
        if (user.authProvider === "local") {

            // Vérifier que l'email n'existe pas déjà
            if (email && email !== user.email) {
                const emailUsed = await User.findOne({ email });
                if (emailUsed) {
                    return res.status(400).json({ message: "Cet email est déjà utilisé" });
                }
                user.email = email;
            }

            // Vérifier ancien mot de passe
            if (oldPassword) {
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: "Ancien mot de passe incorrect" });
                }
            }

            // Nouveau mot de passe
            if (newPassword) {
                const hashed = await bcrypt.hash(newPassword, 10);
                user.password = hashed;
            }
        }

        /** 🔴 4. Spécifique utilisateur Google — email et mdp ne changent pas */
        if (user.authProvider === "google") {
            // On interdit de changer email + mot de passe
            if (email && email !== user.email) {
                return res.status(400).json({ message: "Un compte Google ne peut pas modifier son email." });
            }
            if (oldPassword || newPassword) {
                return res.status(400).json({ message: "Ce compte Google ne peut pas changer de mot de passe." });
            }
        }

        /** 🔵 5. Mise à jour des autres infos communes **/
        if (phone) user.phone = phone;
        if (ville) user.ville = ville;
        if (bio) user.bio = bio;

        await user.save();

        res.json({ message: "Profil modifié avec succès", user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
}







///yelzem tgued les badges   w amehi fonction taa profil tekhdem beha 
//*****************************MAYSSA***************************

// ========================================
// 1. TON PROFIL CONNECTÉ (avec événements + badges)
// ========================================

exports.getMyProfile = async (req, res) => {
  try {
    const user = req.user;
    const Candidature = require("../models/candidature");

    // Récupère toutes ses participations acceptées
    const participations = await Candidature.find({
      user_id: user._id,
      statut: "acceptee",
    }).populate("event_id", "titre date lieu photo couverture");

    const badges = user.badges || [];

    res.json({
      profil: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ville: user.ville || "",
        phone: user.phone || "",
        photo: user.photo || "",
        bio: user.bio || "",
        organisation_infos: user.organisation_infos || null,
        createdAt: user.createdAt,

        // NOUVEAU : tout ce qui rend le profil impressionnant
        participations: participations.map((c) => ({
          _id: c.event_id._id,
          titre: c.event_id.titre,
          date: c.event_id.date,
          lieu: c.event_id.lieu,
          photo: c.event_id.photo || c.event_id.couverture,
        })),
        nombre_participations: participations.length,
        badges: badges,
        niveau:
          badges.length >= 10
            ? "Légende"
            : badges.length >= 5
            ? "Expert"
            : badges.length >= 2
            ? "Confirmé"
            : "Débutant",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ========================================
// 2. TOUS LES UTILISATEURS (liste admin ou recherche)
// ========================================
exports.getAllUsers = async (req, res) => {
  try {
    const User = require("../models/user");
    const users = await User.find({})
      .select("-password -resetPasswordToken -resetPasswordExpires -__v")
      .sort({ createdAt: -1 });

    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// ========================================
// 3. PROFIL PUBLIC D’UN UTILISATEUR PAR ID (le plus impressionnant)
// ========================================
exports.getPublicProfile = async (req, res) => {
  try {
    const User = require("../models/user");
    const Candidature = require("../models/candidature");

    const user = await User.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires -__v");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Récupère ses événements acceptés
    const participations = await Candidature.find({
      user_id: user._id,
      statut: "acceptee",
    }).populate("event_id", "titre date lieu photo couverture");

    const badges = user.badges || [];

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ville: user.ville || "",
        phone: user.phone || "",
        photo: user.photo || "",
        bio: user.bio || "",

        participations: participations.map((c) => ({
          _id: c.event_id._id,
          titre: c.event_id.titre,
          date: c.event_id.date,
          lieu: c.event_id.lieu,
          photo: c.event_id.photo || c.event_id.couverture,
        })),
        nombre_participations: participations.length,
        badges: badges,
        niveau:
          badges.length >= 10
            ? "Légende"
            : badges.length >= 5
            ? "Expert"
            : badges.length >= 2
            ? "Confirmé"
            : "Débutant",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ID invalide ou erreur serveur" });
  }
};



