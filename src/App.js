import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Scrollbar from 'smooth-scrollbar';

// Importação direta das imagens
import circulo1 from './imagens/circulo1.jpg';
import salo from './imagens/salo.png';
import fundo1 from './imagens/fundo1.png';
import aura from './imagens/aura.jpg';

// Função para criar a seção de parallax
const ParallaxSection = ({ className, backgroundImage }) => (
  <section
    className={`parallax-background-section ${className}`}
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="parallax-background-element"></div>
  </section>
);

// Função para criar o modal
const Modal = ({ image, closeModal, changeSlide }) => (
  <div className="modal" style={{ display: image ? 'block' : 'none' }}>
    <span className="close" onClick={closeModal}>&times;</span>
    <div className="modal-content">
      <a className="prev" onClick={() => changeSlide(-1)}>&#10094;</a>
      <img className="modal-img" src={image} alt="Modal" />
      <a className="next" onClick={() => changeSlide(1)}>&#10095;</a>
    </div>
  </div>
);

// Função para criar a galeria
const Gallery = ({ images, openModal }) => (
  <section className="gallery">
    <div className="image-container">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Imagem ${index + 1}`}
          onClick={() => openModal(index)}
          className="gallery-img"
        />
      ))}
    </div>
  </section>
);

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  const images = [circulo1, circulo1, circulo1, circulo1, salo];

  const openModal = (index) => {
    setCurrentSlide(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const changeSlide = (direction) => {
    let newIndex = currentSlide + direction;
    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const bodyScrollBar = Scrollbar.init(scroller, {
      damping: 0.05,
      delegateTo: document,
      thumbMinSize: 15
    });

    ScrollTrigger.scrollerProxy(".scrollbar-container", {
      scrollTop(value) {
        if (arguments.length) {
          bodyScrollBar.scrollTop = value;
        }
        return bodyScrollBar.scrollTop;
      }
    });

    bodyScrollBar.addListener(ScrollTrigger.update);

    gsap.utils.toArray('.parallax-background-section').forEach((section, i) => {
      const bg = section.querySelector(".parallax-background-element");
      if (!bg) return;

      if (i) {
        bg.style.backgroundPosition = `50% ${window.innerHeight / 2}px`;
        gsap.to(bg, {
          backgroundPosition: `50% ${-window.innerHeight / 2}px`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: true,
            onUpdate: function(self) {
              gsap.set(bg, { top: self.scroll() - section.offsetTop });
            }
          }
        });
      } else {
        bg.style.backgroundPosition = "50% 0px";
        gsap.to(bg, {
          backgroundPosition: `50% ${-window.innerHeight / 2}px`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            scrub: true,
            onUpdate: function(self) {
              gsap.set(bg, { top: self.scroll() - section.offsetTop });
            }
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (bodyScrollBar) bodyScrollBar.destroy();
    };
  }, [currentSlide]);

  return (
    <div className="App">
      <header>
        <h1>Galeria Dinâmica com Efeito Parallax</h1>
      </header>
      <main id="primary" className="site-main">
        <div className="scrollbar-container" ref={scrollContainerRef}>
          <ParallaxSection className="pbe-2" backgroundImage={aura} />
          <Gallery images={images} openModal={openModal} />
          <ParallaxSection className="pbe-1" backgroundImage={fundo1} />
        </div>
      </main>
      <Modal
        image={modalOpen ? images[currentSlide] : null}
        closeModal={closeModal}
        changeSlide={changeSlide}
      />
    </div>
  );
}

export default App;
