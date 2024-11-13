// Déclarez la fonction asynchrone pour pouvoir utiliser await
const works = await fetch(`http://localhost:5678/api/works`).then((works) =>
  works.json()
);
const filtres = await fetch(`http://localhost:5678/api/categories`).then(
  (filtres) => filtres.json()
);

export function addGallery() {
  // Sélectionner le conteneur où les éléments seront ajoutés
  const galleryContainer = document.querySelector(".gallery");

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
}

// Appeler la fonction pour ajouter la galerie
addGallery();

function addFiltres() {
  const filtresContainer = document.querySelector(".filtres");

  const tous = document.createElement("div");
  tous.classList.add("filtreBouton");
  tous.innerHTML = `
    <button type="button" id="tous">Tous</button>
    `;
  filtresContainer.appendChild(tous);

  for (let i = 0; i < filtres.length; i++) {
    const filtre = filtres[i];
    const categorie = document.createElement("div");
    categorie.classList.add("filtreBouton");
    categorie.innerHTML = `
  <button type="button" id="${filtre.id}">${filtre.name}</button>
  `;
    filtresContainer.appendChild(categorie);

    // Fonction de tri avec les boutons
    const boutonTrier = document.getElementById(filtre.id);
    boutonTrier.addEventListener("click", function () {
      const filteredWorks = works.filter(
        (work) => work.categoryId === filtre.id
      );
      displayFilteredWorks(filteredWorks);
    });
  }
  // Afficher tous les travaux
  const tousButton = document.getElementById("tous");
  tousButton.addEventListener("click", function () {
    displayFilteredWorks(works);
  });
}

function displayFilteredWorks(filteredWorks) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  // Ajouter les travaux filtrés
  for (let i = 0; i < filteredWorks.length; i++) {
    const work = filteredWorks[i];
    const card = document.createElement("figure");
    card.innerHTML = `
              <img src="${work.imageUrl}" alt="${work.title}" />
              <figcaption>${work.title}</figcaption>
          `;

    galleryContainer.appendChild(card);
  }
}
addFiltres();
