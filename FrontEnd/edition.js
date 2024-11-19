//import { addGallery } from "./index.js"; NE MARCHE PAS (importe aussi addFiltres//

// Déclarez la fonction asynchrone pour pouvoir utiliser await
const works = await fetch(`http://localhost:5678/api/works`).then((works) =>
  works.json()
);

export function addGallery() {
  // Sélectionner le conteneur où les éléments seront ajoutés
  const galleryContainer = document.querySelector(".gallery");
  const galleryContainerModal = document.querySelector(".gallery-modal");

  // Parcourir les éléments récupérés
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // Créer une nouvelle carte pour chaque élément
    const card = document.createElement("figure");
    card.setAttribute("data-id", `${work.id}`);
    card.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" />
                <figcaption>${work.title}</figcaption>
            `;

    // Ajouter la carte au conteneur de la galerie
    galleryContainer.appendChild(card);
  }

  //Créer les cartes dans la modale en édition//
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // Créer une nouvelle carte pour chaque élément
    const card = document.createElement("figure");
    card.setAttribute("data-id", `${work.id}`);
    card.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" />
                <i data-id="${work.id}" class="trash-icon fa-solid fa-trash-can"></i>
            `;

    // Ajouter la carte au conteneur de la galerie
    galleryContainerModal.appendChild(card);
  }
}

// Appeler la fonction pour ajouter la galerie
addGallery();

//Afficher modal1//
const openModal1 = function (e) {
  const target = document.getElementById("modal1");
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
};

document.querySelectorAll(".modifier").forEach((a) => {
  a.addEventListener("click", openModal1);
});

//Afficher modal2//
const openModal2 = function (e) {
  const target = document.getElementById("modal2");
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  closeModal1();
};

const a = document.querySelector(".ajouter-une-photo");
if (a) {
  a.addEventListener("click", openModal2);
}

//fermer modal//
const closeButton = document.querySelectorAll(".croix");
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const arrowLeft = document.getElementById("arrow-left");

function closeModal1() {
  modal1.style.display = "none";
}
function closeModal2() {
  modal2.style.display = "none";
}

closeButton.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal1();
    closeModal2();
  });
});

modal1.addEventListener("click", (event) => {
  if (event.target === modal1) {
    closeModal1();
  }
});
modal2.addEventListener("click", (event) => {
  if (event.target === modal2) {
    closeModal2();
  }
});

//Revenir à la moddal d'avant//
arrowLeft.addEventListener("click", () => {
  closeModal2();
  openModal1();
});

//Supprimer un projet//

const token = sessionStorage.getItem("authToken");
async function deleteProject(projectId) {
  try {
    const response = await fetch(
      `http://localhost:5678/api/works/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      document
        .querySelectorAll(`figure[data-id="${projectId}"]`)
        .forEach((figure) => {
          figure.remove();
        });
    } else {
      console.error("Erreur lors de la suppression du projet");
    }
  } catch (error) {
    console.error("Erreur de connexion à l'API", error);
  }
}

//Appel de la fonction suppression en cliquant sur les icones poubelle//
document.querySelectorAll(".trash-icon").forEach((icon) => {
  icon.addEventListener("click", (event) => {
    const projectId = event.target.getAttribute("data-id"); // Récupère l'ID du projet
    if (projectId) {
      deleteProject(projectId);
    }
  });
});

//Ajouter les catégories dans le menu déroulant de la modal Ajout photo//
async function addCategories() {
  const categories = document.getElementById("choixCategorie");

  try {
    const filtres = await fetch(`http://localhost:5678/api/categories`).then(
      (response) => response.json()
    );

    for (let i = 0; i < filtres.length; i++) {
      const filtre = filtres[i];
      // Utiliser insertAdjacentHTML pour ajouter chaque option sans écraser les autres
      categories.insertAdjacentHTML(
        "beforeend",
        `<option value="${filtre.id}">${filtre.name}</option>`
      );
    }
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
}

addCategories();

//Ajout photo//
// Sélection des éléments du DOM
const addPhotoBtn = document.getElementById("add-photo-btn");
const fileInput = document.getElementById("file-input");
const photoContainer = document.getElementById("photo-container");

// Fonction pour prévisualiser l'image sélectionnée
function previewImage(event) {
  const file = event.target.files[0]; // Obtenir le fichier sélectionné
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    // Chargement de l'image pour prévisualisation
    reader.onload = function (e) {
      // Créer une balise <img> pour afficher l'image
      const img = document.createElement("img");
      img.classList.add("nouvelle-image");
      img.src = e.target.result; // Assigner la source de l'image

      // Vider le contenu actuel, afficher l'image et masquer le bouton
      photoContainer.innerHTML = "";
      photoContainer.appendChild(img);

      // Permettre de cliquer sur l'image elle-même pour changer la photo
      img.addEventListener("click", () => {
        fileInput.click(); // Rouvrir le sélecteur de fichier
      });
    };

    // Lire le fichier sous forme d'URL de données
    reader.readAsDataURL(file);
  } else {
    alert("Veuillez sélectionner une image valide.");
  }
}

// Gestionnaire de clic pour ouvrir le sélecteur de fichiers
addPhotoBtn.addEventListener("click", () => {
  fileInput.click(); // Ouvre la boîte de dialogue pour sélectionner un fichier
});

// Lorsque l'utilisateur sélectionne un fichier, prévisualiser l'image
fileInput.addEventListener("change", previewImage);

//Valider Ajout//
const validerButton = document.getElementById("valider-photo");
const titleInput = document.querySelector("input[name='titre-texte']");
const categorySelect = document.getElementById("choixCategorie");

// Fonction de mise à jour de l'état du bouton "Valider"
function updateValiderButtonState() {
  if (
    fileInput.files.length > 0 &&
    titleInput.value.trim() !== "" &&
    categorySelect.value !== ""
  ) {
    // Activer et changer la couleur du bouton
    validerButton.disabled = false;
    validerButton.style.backgroundColor = "#1D6154"; // Couleur active
  } else {
    // Désactiver le bouton et réinitialiser la couleur
    validerButton.disabled = true;
    validerButton.style.backgroundColor = "#CCCCCC"; // Couleur inactive (exemple : gris)
  }
}

// Ajouter des écouteurs d'événements pour surveiller les changements dans les champs
fileInput.addEventListener("change", updateValiderButtonState);
titleInput.addEventListener("input", updateValiderButtonState);
categorySelect.addEventListener("change", updateValiderButtonState);

validerButton.addEventListener("click", addPhotoToProjects);
// Fonction pour ajouter la photo au projet lors du clic sur "Valider"

async function addPhotoToProjects() {
  // Vérifier que tous les champs sont bien remplis (sécurité supplémentaire)
  if (
    fileInput.files.length === 0 ||
    titleInput.value.trim() === "" ||
    categorySelect.value === ""
  ) {
    alert("Veuillez remplir tous les champs avant de valider.");
    return;
  }

  const file = fileInput.files[0];
  const title = titleInput.value;

  // Convertir categorySelect.value en un nombre
  const categoryId = Number(categorySelect.value);

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", categoryId);

  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Si la réponse n'est pas OK, afficher l'erreur dans la console
    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur lors de l'ajout de la photo :", error);
      alert(
        `Erreur (${response.status}): ${error.message || "Détails inconnus"}`
      );
    } else {
      // Si la requête réussit, récupérer les nouvelles données
      const updatedWorks = await fetch(`http://localhost:5678/api/works`).then(
        (res) => res.json()
      );

      // Mettre à jour les galeries
      updateGalleries(updatedWorks);
      closeModal2();
      resetForm();
    }
  } catch (error) {
    console.error("Erreur de connexion à l'API", error);
  }
}

function updateGalleries(works) {
  const galleryContainer = document.querySelector(".gallery");
  const galleryContainerModal = document.querySelector(".gallery-modal");

  // Vider les galeries
  galleryContainer.innerHTML = "";
  galleryContainerModal.innerHTML = "";

  // Recréer les galeries avec les données actualisées
  works.forEach((work) => {
    // Ajouter dans la galerie principale
    const card = document.createElement("figure");
    card.setAttribute("data-id", `${work.id}`);
    card.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
    `;
    galleryContainer.appendChild(card);

    // Ajouter dans la galerie de la modal
    const modalCard = document.createElement("figure");
    modalCard.setAttribute("data-id", `${work.id}`);
    modalCard.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <i data-id="${work.id}" class="trash-icon fa-solid fa-trash-can"></i>
    `;
    galleryContainerModal.appendChild(modalCard);
  });

  // Réactiver les événements de suppression
  document.querySelectorAll(".trash-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const projectId = event.target.getAttribute("data-id");
      if (projectId) {
        deleteProject(projectId);
      }
    });
  });
}

function resetForm() {
  // Réinitialiser les champs de texte
  titleInput.value = "";

  // Supprimer et recréer les champs et boutons du formulaire
  photoContainer.innerHTML = `
    <i class="fa-regular fa-image"></i>
    <button type="button" id="add-photo-btn">+ Ajouter photo</button>
    <p>jpg.png : 4mo max</p>
    <input
      type="file"
      id="file-input"
      accept="image/*"
      style="display: none"
    />
  `;

  // Récupérer les nouvelles références
  const newFileInput = document.getElementById("file-input");
  const newAddPhotoBtn = document.getElementById("add-photo-btn");

  // Réinitialiser le champ de fichier et la sélection de catégorie
  newFileInput.value = null;
  categorySelect.value = "";

  // Ajouter les nouveaux événements
  newFileInput.addEventListener("change", previewImage);
  newFileInput.addEventListener("change", updateValiderButtonState);
  newAddPhotoBtn.addEventListener("click", () => {
    newFileInput.click();
  });

  // Réinitialiser l'état du bouton "Valider"
  validerButton.disabled = true;
  validerButton.style.backgroundColor = "#CCCCCC";
}
