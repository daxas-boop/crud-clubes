function deletePrompt() {
  const $promptContainer = document.querySelector('#prompt-container');
  $promptContainer.innerHTML = '';
}

function generatePrompt(id, name) {
  const $promptContainer = document.querySelector('#prompt-container');
  const $modal = document.createElement('div');
  $modal.id = 'prompt';
  $modal.className = 'modal is-active';
  const $modalBackground = document.createElement('div');
  $modalBackground.className = 'modal-background';
  const $modalCard = document.createElement('div');
  $modalCard.className = 'modal-card';
  const $modalHeader = document.createElement('header');
  $modalHeader.className = 'modal-card-head';
  const $modalTitle = document.createElement('p');
  $modalTitle.className = 'modal-card-title has-text-centered';
  $modalTitle.innerText = `Eliminar equipo ${name}`;
  const $modalBody = document.createElement('section');
  $modalBody.className = 'modal-card-body has-text-centered';
  $modalBody.innerText = 'Si eliminas el equipo se borrará para siempre.';
  const $modalFooter = document.createElement('footer');
  $modalFooter.className = 'modal-card-foot is-flex is-justify-content-center';
  const $deleteBtn = document.createElement('a');
  $deleteBtn.setAttribute('href', `/club/delete/${id}`);
  $deleteBtn.className = 'button is-danger';
  $deleteBtn.innerText = 'Si, eliminalo.';
  const $cancelBtn = document.createElement('button');
  $cancelBtn.className = 'button';
  $cancelBtn.innerHTML = 'Cancelar';
  $cancelBtn.id = 'cancel-btn';
  $cancelBtn.addEventListener('click', () => {
    deletePrompt();
  });

  $modal.appendChild($modalBackground);
  $modal.appendChild($modalCard);
  $modalCard.appendChild($modalHeader);
  $modalCard.appendChild($modalBody);
  $modalCard.appendChild($modalFooter);
  $modalHeader.appendChild($modalTitle);
  $modalFooter.appendChild($deleteBtn);
  $modalFooter.appendChild($cancelBtn);
  $promptContainer.appendChild($modal);
}

function handleDeleteButtonClick() {
  const $deleteBtns = document.querySelectorAll('#delete-btn');

  $deleteBtns.forEach(($deleteBtn) => {
    const { id, name } = $deleteBtn.dataset;

    $deleteBtn.addEventListener('click', () => {
      generatePrompt(id, name);
    });
  });
}

handleDeleteButtonClick();
