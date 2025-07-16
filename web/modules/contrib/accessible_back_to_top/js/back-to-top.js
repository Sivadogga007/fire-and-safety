(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('.back-to-top');

    // handle mouse click
    el.addEventListener('click', () => {
      window.scroll({
        top: 0,
        bottom: 0,
        behavior: 'smooth',
      });
    });

    // handle keypress
    el.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        window.scroll({
          top: 0,
          bottom: 0,
          behavior: 'smooth',
        });
        document.querySelector('.skip-link').focus();
      }
    });

    // hide the button if scroll Y value is less than 1000px
    el.style.display = 'none';
    document.addEventListener('scroll', () => {
      if (Math.round(window.scrollY) < 800) {
        el.style.display = 'none';
      } else {
        el.style.display = 'flex';
      }
    });
  });
})();
