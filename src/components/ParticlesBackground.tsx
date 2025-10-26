import { useEffect } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

export const ParticlesBackground = () => {
  useEffect(() => {
    // Check if particles.js already exists
    if (window.particlesJS) {
      initParticles();
      return;
    }

    // Dynamically load particles.js script
    const script = document.createElement('script');
    script.src = '/particles.js';
    script.onload = () => {
      initParticles();
    };
    script.onerror = () => {
      console.error('Failed to load particles.js');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initParticles = () => {
    // Initialize particles after script loads
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: ['#39c0ed', '#4dd0e1', '#26c6da']
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000'
              }
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 2,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#39c0ed',
              opacity: 0.3,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'grab'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 200,
                line_linked: {
                  opacity: 0.8
                }
              },
              bubble: {
                distance: 300,
                size: 6,
                duration: 2,
                opacity: 0.8,
                speed: 3
              },
              repulse: {
                distance: 100,
                duration: 0.4
              },
              push: {
                particles_nb: 2
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
      });
    } else {
      console.error('particles.js not loaded');
    }
  };

  return (
    <div
      id="particles-js"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};
