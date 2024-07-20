const tapeCover = document.querySelector('.tape-cover');
const radioGroup = document.querySelector('.radio-group');
let currentClass = '';

function changeSide() {
  const checkedRadio = radioGroup.querySelector(':checked');
  const showClass = 'show-' + checkedRadio.value;
  if (currentClass) {
    tapeCover.classList.remove(currentClass);
  }
  tapeCover.classList.add(showClass);
  currentClass = showClass;
}

// Set initial side
changeSide();

radioGroup.addEventListener('change', changeSide);