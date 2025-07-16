document.addEventListener('DOMContentLoaded', function () {
  // Select all submenu links
  const scrollLinks = document.querySelectorAll('.accordion-scroll-link');
  const backToMenuWrapper = document.querySelector('.back-to-menu-wrapper');

  scrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor behavior

      // Remove active class from all links
      scrollLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active'); // Add active to clicked link

      // Get the target accordion item's collapsible section
      const targetId = this.getAttribute('href').substring(1); // Remove the '#'
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Expand the accordion item using Bootstrap's Collapse API
        const bsCollapse = new bootstrap.Collapse(targetElement, {
          toggle: false // Don't toggle immediately, just initialize
        });
        bsCollapse.show(); // Ensure the item is expanded

        // Smooth scroll to the accordion item
        const headerOffset = 80; // Adjust based on fixed header height
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Show/hide Back to Menu button on scroll (Option B)
  if (backToMenuWrapper) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToMenuWrapper.classList.add('visible');
      } else {
        backToMenuWrapper.classList.remove('visible');
      }
    });
  }

  // Scroll-Spy: Highlight active menu item based on visible accordion section
  const sections = Array.from(document.querySelectorAll('.accordion .accordion-collapse'));
  window.addEventListener('scroll', function () {
    let currentSectionId = '';
    const scrollY = window.scrollY + 150; // Adjust threshold

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId) {
      scrollLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSectionId) {
          link.classList.add('active');
        }
      });
    }
  });
});
