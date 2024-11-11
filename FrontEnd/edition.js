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
    card.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" />
                <i class="fa-solid fa-trash-can"></i>
            `;

    // Ajouter la carte au conteneur de la galerie
    galleryContainerModal.appendChild(card);
  }
}

// Appeler la fonction pour ajouter la galerie
addGallery();

const openModal = function (e) {
  e.preventDefault();

  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
};

document.querySelectorAll(".modifier").forEach((a) => {
  a.addEventListener("click", openModal);
});

const closeButton = document.getElementById("x-mark");
const modal1 = document.getElementById("modal1");

function closeModal() {
  modal1.style.display = "none";
}

closeButton.addEventListener("click", closeModal);

modal1.addEventListener("click", (event) => {
  if (event.target === modal1) {
    closeModal();
  }
});
