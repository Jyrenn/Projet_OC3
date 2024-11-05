// Déclarez la fonction asynchrone pour pouvoir utiliser await
export async function addGallery() {
  try {
    // Effectuer la requête pour récupérer les données
    const response = await fetch(`http://localhost:5678/api/works`);

    // Vérifiez si la réponse est réussie
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Convertir la réponse en JSON
    const works = await response.json();

    // Sélectionner le conteneur où les éléments seront ajoutés
    const galleryContainer = document.querySelector(".gallery"); // Remplacez par la class de votre conteneur

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
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}

// Appeler la fonction pour ajouter la galerie
addGallery();

export async function addFiltres() {
  try {
    const response = await fetch(`http://localhost:5678/api/categories`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const filtres = await response.json();

    const filtresContainer = document.querySelector(".filtres");

    const tous = document.createElement("div");
    tous.classList.add("filtreBouton");
    tous.innerHTML = `
    <button type="button">Tous</button>
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
        console.log(`${filtre.id}`);
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}

addFiltres();
