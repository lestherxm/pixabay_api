document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    let inputQ = document.getElementById('inputQ').value;
    let image_type = document.getElementById('image_type').value;
    let category = document.getElementById('category').value;
    let orientation = document.getElementById('orientation').value;
    let qParam = inputQ.replace(/\s+/g, '+'); // Reemplaza espacios por signos "+"

    // Llamar a la función para consumir la API de Pixabay
    getPixabayImages(qParam, image_type, category, orientation);
});

function getPixabayImages(query = '', image_type = 'all', category = null, orientation = 'horizontal') {
    const apiKey = '25761665-a08c5979c931f988d4561af13';
    let apiUrl = '';
    category != null
    ? apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=${image_type}&orientation=${orientation}&category=${category}`
    : apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=${image_type}&orientation=${orientation}`

    // Realizar la solicitud a la API de Pixabay
    fetch(apiUrl)
        .then(response => response.json())
        .then(images => {
            // Aquí puedes trabajar con los datos de la API
            show(images.hits);
        })
        .catch(error => {
            console.error('Error al obtener datos de la API:', error);
        });
}

function show(images) {
    let rowResultSet = document.querySelector('#rowResultSet');
    rowResultSet.innerHTML = ''; 

    images.forEach(image => {
        // Crear elementos HTML
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-md-4");

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "mb-4", "box-shadow");

        const img = document.createElement("img");

        if (document.getElementById('orientation').value == 'horizontal') {
            img.classList.add("fixHorizontal");
        } else {
            img.classList.add("fixVertical");
        }

        img.classList.add("card-img-top", "img-result");
        img.src = image.largeImageURL;
        img.alt = "Card image cap";
        img.title = "Clic para copiar el enlace"

        // Agregar evento click a la imagen para copiar la URL al portapapeles
        img.addEventListener("click", function() {
            img.classList.add("copied");
            setTimeout(() => {
                img.classList.remove("copied");
            }, 250);
            // Crear un elemento de texto oculto
            const textArea = document.createElement("textarea");
            textArea.value = image.largeImageURL;
            textArea.style.position = "fixed"; // Para asegurarse de que sea visible
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            
            // Mostrar SweetAlert con el mensaje "Copiado" y un ícono de éxito
            Swal.fire({
                title: 'Copiado',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000, // Ocultar automáticamente después de un segundo
            });

        });

        cardDiv.appendChild(img);
        colDiv.appendChild(cardDiv);

        // Adjuntar el nuevo div creado al div existente con id "rowResultSet"
        rowResultSet.appendChild(colDiv);
    });
}

// Peticion inicial a la API de Pixabay
getPixabayImages();