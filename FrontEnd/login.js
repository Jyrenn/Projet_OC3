const login = "http://localhost:5678/api/users/login";

// Gestionnaire de l'événement de soumission du formulaire
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    // Récupère les valeurs des champs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Corps de la requête
    const identifiers = {
      email: email,
      password: password,
    };

    try {
      // Envoie les informations d'identification à l'API via une requête POST
      const response = await fetch(login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(identifiers),
      });

      // Analyse la réponse
      const result = await response.json();

      if (response.ok) {
        // Connexion réussie
        const token = result.token;
        sessionStorage.setItem("authToken", token);
        window.location.href = "edition.html";
      } else {
        // Erreur de connexion, affiche un message d'erreur
        let errorMessage = "Email ou mot de passe incorrect.";

        if (result.message) {
          errorMessage = result.message;
        }

        document.getElementById("message").textContent = errorMessage;
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      document.getElementById("message").textContent =
        "Une erreur est survenue. Veuillez réessayer plus tard.";
    }
  });
