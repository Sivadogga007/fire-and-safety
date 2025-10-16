import { once } from 'core/once';

document.addEventListener('DOMContentLoaded', () => {
  // Run this code only once
  once('accordion-submenu', '.accordion-scroll-link').forEach(link => {
    const backToMenuWrapper = document.querySelector('.back-to-menu-wrapper');

    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active from all links
      document.querySelectorAll('.accordion-scroll-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Bootstrap collapse
        const bsCollapse = new bootstrap.Collapse(targetElement, { toggle: false });
        bsCollapse.show();

        // Smooth scroll
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });

    // Scroll-spy for highlighting menu item
    const sections = Array.from(document.querySelectorAll('.accordion .accordion-collapse'));

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 150;
      let currentSectionId = '';

      sections.forEach(section => {
        if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
          currentSectionId = section.id;
        }
      });

      if (currentSectionId) {
        document.querySelectorAll('.accordion-scroll-link').forEach(l => {
          l.classList.toggle(
            'active',
            l.getAttribute('href').substring(1) === currentSectionId
          );
        });
      }

      // Show/hide Back to Menu button
      if (backToMenuWrapper) {
        backToMenuWrapper.classList.toggle('visible', window.scrollY > 300);
      }
    });
  });
});
