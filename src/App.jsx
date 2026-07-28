import React, { useState, useEffect } from 'react';

function App() {
  // 1. Estado para el Menú Móvil
  const [menuActive, setMenuActive] = useState(false);

  // 2. Estado para la Sección Activa
  const [activeSection, setActiveSection] = useState('inicio');

  // 3. Estados para el Formulario de Contacto
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // 4. Efecto para manejar el Scroll (Secciones Activas e IntersectionObserver)
  useEffect(() => {
    // A. Seguimiento de Sección Activa al desplazar
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = 'inicio';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 150)) {
          current = section.getAttribute('id') || 'inicio';
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);

    // B. Scroll Reveal con IntersectionObserver (Micro-interacciones fluidas)
    const revealElements = document.querySelectorAll(
      '.pillar-card, .skill-card, .project-card, .contact-item-card, .contact-form-wrapper'
    );

    // Configuración inicial de estilos para la animación
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // 5. Manejo del Formulario
  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', text: '' });

    fetch('https://formspree.io/f/xlgqlvbg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message
      })
    })
      .then(response => {
        setIsSubmitting(false);
        if (response.ok) {
          setFormStatus({
            type: 'success',
            text: `¡Muchas gracias, ${formData.name}! Tu mensaje ha sido enviado con éxito. Me pondré en contacto contigo pronto.`
          });
          setFormData({ name: '', email: '', message: '' });
        } else {
          setFormStatus({
            type: 'error',
            text: 'Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo o escríbeme por WhatsApp.'
          });
        }

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          setFormStatus({ type: '', text: '' });
        }, 5000);
      })
      .catch(error => {
        setIsSubmitting(false);
        setFormStatus({
          type: 'error',
          text: 'Hubo un error de conexión. Por favor, intenta de nuevo o escríbeme por WhatsApp.'
        });
        setTimeout(() => {
          setFormStatus({ type: '', text: '' });
        }, 5000);
      });
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('drewgamer681@gmail.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    });
  };

  return (
    <>
      {/* Background Glows for Ambience */}
      <div className="glow-bg glow-bg-1"></div>
      <div className="glow-bg glow-bg-2"></div>

      {/* Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">
            <span class="logo-accent">&lt;</span>Dreyeles<span class="logo-accent">/&gt;</span>
          </a>
          <nav className={`nav-menu ${menuActive ? 'active' : ''}`} id="nav-menu">
            <a
              href="#inicio"
              className={`nav-link ${activeSection === 'inicio' ? 'active' : ''}`}
              onClick={() => setMenuActive(false)}
            >
              Inicio
            </a>
            <a
              href="#sobre-mi"
              className={`nav-link ${activeSection === 'sobre-mi' ? 'active' : ''}`}
              onClick={() => setMenuActive(false)}
            >
              Sobre Mí
            </a>
            <a
              href="#habilidades"
              className={`nav-link ${activeSection === 'habilidades' ? 'active' : ''}`}
              onClick={() => setMenuActive(false)}
            >
              Habilidades
            </a>
            <a
              href="#proyectos"
              className={`nav-link ${activeSection === 'proyectos' ? 'active' : ''}`}
              onClick={() => setMenuActive(false)}
            >
              Proyectos
            </a>
            <a
              href="#contacto"
              className="nav-link btn-contact-nav"
              onClick={() => setMenuActive(false)}
            >
              Contactar
            </a>
          </nav>
          <button
            className="nav-toggle"
            onClick={() => setMenuActive(!menuActive)}
            aria-label="Abrir menú"
          >
            <i className={`fa-solid ${menuActive ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="inicio" class="hero section-scroll">
          <div className="hero-container">
            <div className="hero-content">
              <span className="hero-subtitle">¡Hola! Qué gusto tenerte aquí. Soy</span>
              <h1 className="hero-title">Drey Enmanuel</h1>
              <h2 className="hero-role">Desarrollador Web Full Stack &amp; Diseñador UI/UX </h2>
              <p className="hero-description">
                Especializado en el desarrollo de aplicaciones web y diseño de interfaces (UI/UX). Combino arquitectura de software, bases de datos y creatividad para construir experiencias digitales fluidas, escalables y optimizadas.
              </p>
              <div className="hero-actions">
                <a href="#proyectos" className="btn btn-primary">
                  <i className="fa-solid fa-briefcase"></i> Ver Proyectos
                </a>
                <a href="#contacto" className="btn btn-secondary">
                  <i className="fa-solid fa-envelope"></i> Hablemos
                </a>
              </div>
            </div>
            <div className="hero-avatar">
              <div className="avatar-wrapper">
                <img src="/imagenes/drey_ejecutivo.jpg" alt="Drey Enmanuel" className="avatar-img" />
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="sobre-mi" class="about section-scroll">
          <h2 className="section-title">Sobre Mí</h2>
          <div className="about-container">
            <div className="about-text">
              <p>
                Estudiante de Gestión de Sistemas de la Información y Desarrollador Full Stack. Me apasiona construir productos digitales completos: desde la arquitectura de bases de datos y la lógica del servidor, hasta interfaces frontend fluidas y atractivas.
              </p>
              <p>
                Mi objetivo es crear soluciones integrales que no solo sean escalables y eficientes por dentro, sino que también entreguen una experiencia de usuario (UI/UX) impecable y cuidada al detalle.
              </p>

              {/* Focus Pillars */}
              <div className="pillars-grid">
                <div className="pillar-card">
                  <i className="fa-solid fa-code pillar-icon"></i>
                  <h3>Desarrollo Frontend</h3>
                  <p>Interfaces web dinámicas, maquetación responsiva y aplicaciones escalables con tecnologías modernas.</p>
                </div>
                <div className="pillar-card">
                  <i className="fa-solid fa-database pillar-icon"></i>
                  <h3>Backend &amp; Bases de Datos</h3>
                  <p>Arquitectura de servidores, desarrollo de APIs RESTful y diseño de bases de datos relacionales robustas.</p>
                </div>
                <div className="pillar-card">
                  <i className="fa-solid fa-palette pillar-icon"></i>
                  <h3>Diseño UI/UX &amp; Prototipado</h3>
                  <p>Diseño de interfaces, arquitectura de información y prototipos interactivos en Figma orientados al usuario.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="habilidades" class="skills section-scroll">
          <h2 className="section-title">Habilidades</h2>
          <p className="section-subtitle">Las herramientas y tecnologías que utilizo para materializar mis proyectos.</p>
          <div className="skills-grid">
            {/* Skill Card: Angular */}
            <div className="skill-card">
              <div className="skill-icon-wrapper angular-glow">
                <i className="fa-brands fa-angular"></i>
              </div>
              <h3>Angular</h3>
              <span className="skill-tag">Frontend App</span>
            </div>
            {/* Skill Card: React */}
            <div className="skill-card">
              <div className="skill-icon-wrapper react-glow">
                <i className="fa-brands fa-react"></i>
              </div>
              <h3>React</h3>
              <span className="skill-tag">Librería Frontend</span>
            </div>
            {/* Skill Card: Node.js */}
            <div className="skill-card">
              <div className="skill-icon-wrapper node-glow">
                <i className="fa-brands fa-node-js"></i>
              </div>
              <h3>Node.js</h3>
              <span className="skill-tag">Backend &amp; APIs</span>
            </div>
            {/* Skill Card: Spring Boot */}
            <div className="skill-card">
              <div className="skill-icon-wrapper spring-glow">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <h3>Spring Boot</h3>
              <span className="skill-tag">Backend &amp; APIs Java</span>
            </div>
            {/* Skill Card: MySQL */}
            <div className="skill-card">
              <div className="skill-icon-wrapper mysql-glow">
                <i className="fa-solid fa-database"></i>
              </div>
              <h3>MySQL</h3>
              <span className="skill-tag">Base de Datos</span>
            </div>
            {/* Skill Card: JavaScript */}
            <div className="skill-card">
              <div className="skill-icon-wrapper js-glow">
                <i className="fa-brands fa-js"></i>
              </div>
              <h3>JavaScript</h3>
              <span className="skill-tag">Interactividad</span>
            </div>
            {/* Skill Card: HTML5 / CSS3 */}
            <div className="skill-card">
              <div className="skill-icon-wrapper html-glow">
                <i className="fa-brands fa-html5"></i>
                <i className="fa-brands fa-css3-alt" style={{ marginLeft: '8px' }}></i>
              </div>
              <h3>HTML5 / CSS3</h3>
              <span className="skill-tag">Estructura y Estilo</span>
            </div>
            {/* Skill Card: Bootstrap */}
            <div className="skill-card">
              <div className="skill-icon-wrapper bootstrap-glow">
                <i className="fa-brands fa-bootstrap"></i>
              </div>
              <h3>Bootstrap</h3>
              <span className="skill-tag">Maquetación</span>
            </div>
            {/* Skill Card: Figma */}
            <div className="skill-card">
              <div className="skill-icon-wrapper figma-glow">
                <i className="fa-brands fa-figma"></i>
              </div>
              <h3>Figma</h3>
              <span className="skill-tag">Diseño UI/UX</span>
            </div>
            {/* Skill Card: Git / GitHub */}
            <div className="skill-card">
              <div className="skill-icon-wrapper git-glow">
                <i className="fa-brands fa-git-alt"></i>
              </div>
              <h3>Git / GitHub</h3>
              <span className="skill-tag">Control de Versiones</span>
            </div>
            {/* Skill Card: Animación Vectorial */}
            <div className="skill-card">
              <div className="skill-icon-wrapper animation-glow">
                <i className="fa-solid fa-bezier-curve"></i>
              </div>
              <h3>Vectores &amp; Animación</h3>
              <span className="skill-tag">SVG / Motion</span>
            </div>
          </div>
        </section>

        {/* Projects Section (Catalog) */}
        <section id="proyectos" class="projects section-scroll">
          <h2 className="section-title">Proyectos</h2>
          <p className="section-subtitle">Diseños y desarrollos interactivos listos para explorar. Haz clic en "Probar Demo" para abrirlos directamente.</p>

          <div className="projects-catalog">
            {/* Project Card 1 (Neo SISOL) */}
            <article className="project-card">
              <div className="project-image-container">
                <img src="/imagenes/imagen_sisol_ra.png" alt="Vista previa Neo SISOL" className="project-img" />
                <div className="project-overlay">
                  <span className="project-badge">Destacado</span>
                </div>
              </div>
              <div className="project-details">
                <div className="project-tags">
                  <span>Angular</span>
                  <span>Node.js</span>
                  <span>Express</span>
                  <span>MySQL</span>
                  <span>RxJS</span>
                </div>
                <h3 className="project-name">Sistema de Gestión de Citas Médicas - Neo SISOL</h3>
                <p className="project-desc">
                  Sistema web full-stack para la gestión y reserva de citas médicas en tiempo real. Cuenta con paneles de control personalizados para pacientes, médicos y administradores, integración de pagos y flujo dinámico de horarios.
                </p>
                <div className="project-links">
                  <a href="https://neo-sisol-angular-react.vercel.app" className="btn-catalog btn-demo" target="_blank" rel="noopener noreferrer">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Probar Demo
                  </a>
                  <a href="https://github.com/Dreyeles/Neo_sisol_Angular-React" className="btn-catalog btn-repo" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-github"></i> Ver GitHub
                  </a>
                </div>
              </div>
            </article>

            {/* Project Card 2 (Turba Autotuning) */}
            <article className="project-card">
              <div className="project-image-container">
                <img src="/imagenes/turbaimain.png" alt="Vista previa Turba Autotuning" className="project-img" />
                <div className="project-overlay">
                  <span className="project-badge">Producción</span>
                </div>
              </div>
              <div className="project-details">
                <div className="project-tags">
                  <span>Astro</span>
                  <span>Bootstrap 5</span>
                  <span>CSS3</span>
                  <span>Vercel</span>
                </div>
                <h3 className="project-name">Plataforma Web y Catálogo Digital de Equipamiento Automotriz Turba Autotuning</h3>
                <p className="project-desc">
                  Plataforma corporativa y catálogo digital especializado en multimedia automotriz, optimizado mediante renderizado estático y CSS personalizado para garantizar máxima velocidad, responsividad y SEO integrado.
                </p>
                <div className="project-links">
                  <a href="https://turbaautotuning.vercel.app" className="btn-catalog btn-demo" target="_blank" rel="noopener noreferrer">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Probar Demo
                  </a>
                  <a href="https://github.com/Dreyeles/Turbaautotuning" className="btn-catalog btn-repo" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-github"></i> Ver GitHub
                  </a>
                </div>
              </div>
            </article>

            {/* Project Card 3 (Placeholder: Neo-Sisol Dashboard) */}
            <article className="project-card">
              <div className="project-image-container">
                <div className="project-placeholder-img">
                  <i className="fa-solid fa-heart-pulse placeholder-icon"></i>
                </div>
                <div className="project-overlay">
                  <span className="project-badge">Desarrollo</span>
                </div>
              </div>
              <div className="project-details">
                <div className="project-tags">
                  <span>React</span>
                  <span>CSS Grid</span>
                  <span>Mock API</span>
                </div>
                <h3 class="project-name">Dashboard Médico Neo-Sisol</h3>
                <p className="project-desc">
                  Interfaz web interactiva para la reserva y consulta de citas médicas, con simulación de inicio de sesión y base de datos local mockeada.
                </p>
                <div className="project-links">
                  <a href="#" className="btn-catalog btn-demo disabled-link" onClick={e => e.preventDefault()}>
                    <i className="fa-solid fa-lock"></i> Próximamente
                  </a>
                  <a href="#" className="btn-catalog btn-repo disabled-link" onClick={e => e.preventDefault()}>
                    <i className="fa-brands fa-github"></i> Código
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" class="contact section-scroll">
          <h2 className="section-title">Hablemos</h2>
          <p className="section-subtitle">¿Tienes un proyecto en mente o una propuesta laboral? Estaré encantado de conversar contigo.</p>

          <div className="contact-container">
            {/* Contact Info / Fast Links */}
            <div className="contact-info">
              <h3>Información de Contacto</h3>
              <p>Utiliza cualquiera de los siguientes medios rápidos. Respondo con mayor velocidad vía WhatsApp.</p>

              <div className="contact-links-list">
                <a
                  href="mailto:drewgamer681@gmail.com"
                  className="contact-item-card"
                  onClick={handleCopyEmail}
                >
                  <div className="contact-item-icon email-color">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="contact-item-text">
                    <span>{emailCopied ? '¡Copiado al portapapeles!' : 'Clic para copiar correo'}</span>
                    <strong>Drewgamer681@gmail.com</strong>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/51976302352?text=Hola%20Drey,%20vi%20tu%20portafolio%20y%20me%20interesa%20tu%20perfil"
                  className="contact-item-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-item-icon whatsapp-color">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div className="contact-item-text">
                    <span>Mensaje directo</span>
                    <strong>Enviar mensaje en WhatsApp</strong>
                  </div>
                </a>
              </div>

              {/* Social Network Grid */}
              <div className="social-socials-group">
                <h4>Mis Redes Sociales</h4>
                <div className="social-links-grid">
                  <a href="https://www.facebook.com/Dreyeles" target="_blank" rel="noopener noreferrer" className="social-circle facebook-color" title="Facebook">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="https://www.youtube.com/@dreyaymituma5220" target="_blank" rel="noopener noreferrer" className="social-circle youtube-color" title="YouTube">
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                  <a href="https://github.com/Dreyeles" target="_blank" rel="noopener noreferrer" className="social-circle github-color" title="GitHub">
                    <i className="fa-brands fa-github"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Simplistic Contact Form */}
            <div className="contact-form-wrapper">
              <h3>Enviar un Mensaje</h3>
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="form-name">Nombre Completo</label>
                  <input
                    type="text"
                    id="form-name"
                    placeholder="Ej: Maria Perez"
                    value={formData.name}
                    onChange={e => handleInputChange(e, 'name')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="form-email"
                    placeholder="Ej: maria@ejemplo.com"
                    value={formData.email}
                    onChange={e => handleInputChange(e, 'email')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-message">Mensaje</label>
                  <textarea
                    id="form-message"
                    rows="5"
                    placeholder="¿En qué te puedo ayudar?"
                    value={formData.message}
                    onChange={e => handleInputChange(e, 'message')}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Enviando...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane"></i> Enviar Mensaje</>
                  )}
                </button>
              </form>

              {formStatus.text && (
                <div className={`form-status-message ${formStatus.type}`}>
                  {formStatus.text}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2026 Drey Enmanuel. Creado con pasión y código limpio.</p>
          <a href="#" className="btn-top" aria-label="Volver arriba"><i className="fa-solid fa-arrow-up"></i></a>
        </div>
      </footer>
    </>
  );
}

export default App;
