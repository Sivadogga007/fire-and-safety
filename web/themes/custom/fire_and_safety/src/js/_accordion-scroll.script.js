document.addEventListener('DOMContentLoaded', function () {
    // Select all submenu links
    const scrollLinks = document.querySelectorAll('.accordion-scroll-link');
  
    scrollLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior
  
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
          const headerOffset = 80; // Adjust based on fixed header height, if any
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;
  
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  });