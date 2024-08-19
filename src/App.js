import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { Parallax } from 'react-parallax';
import Scrollbar from 'smooth-scrollbar';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';

// Importar todas as imagens da pasta imagens
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const images = importAll(require.context('./imagens', false, /\.(jpg|jpeg|png)$/));
const fundoImagens = importAll(require.context('./imagensFundo', false, /\.(jpg|jpeg|png)$/));

const Modal = ({ image, closeModal, caption, changeSlide }) => (
  <div className="modal" style={{ display: image ? 'block' : 'none' }}>
    <span className="close" onClick={closeModal}>&times;</span>
    <div className="modal-content">
      <a className="prev" onClick={() => changeSlide(-1)}>&#10094;</a>
      <img className="modal-img" src={image} alt="Modal" />
      <div className="modal-caption">{caption}</div>
      <a className="next" onClick={() => changeSlide(1)}>&#10095;</a>
    </div>
  </div>
);

const Gallery = ({ images, openModal }) => (
  <section className="gallery">
    <div className="image-container">
      {Object.values(images).map((img, index) => (
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

  const openModal = (index) => {
    setCurrentSlide(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const changeSlide = (direction) => {
    let newIndex = currentSlide + direction;
    if (newIndex >= Object.keys(images).length) newIndex = 0;
    if (newIndex < 0) newIndex = Object.keys(images).length - 1;
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

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) {
          bodyScrollBar.scrollTop = value;
        }
        return bodyScrollBar.scrollTop;
      }
    });

    bodyScrollBar.addListener(ScrollTrigger.update);

    ScrollTrigger.defaults({
      scroller: scroller
    });

    gsap.utils.toArray('.parallax-background-section').forEach((section, i) => {
      section.bg = section.querySelector(".parallax-background-element");

      if (i) {
        section.bg.style.backgroundPosition = `50% ${window.innerHeight / 2}px`;
        gsap.to(section.bg, {
          backgroundPosition: `40% ${-window.innerHeight / 2}px`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: true,
            onUpdate: function (self) {
              gsap.set(section.bg, { top: self.scroll() - section.bg.parentElement.offsetTop });
            }
          }
        });
      } else {
        section.bg.style.backgroundPosition = "50% 0px";
        gsap.to(section.bg, {
          backgroundPosition: `50% ${-window.innerHeight / 2}px`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            scrub: true,
            onUpdate: function (self) {
              gsap.set(section.bg, { top: self.scroll() - section.bg.parentElement.offsetTop });
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

  const currentImage = Object.values(images)[currentSlide];
  const caption = `Imagem ${currentSlide + 1}`;

  return (
    <div className="App">
      <header>
        <h1>Galeria Dinâmica com Efeito Parallax</h1>
      </header>
      <main id="primary" className="site-main">
        <div className="scrollbar-container" ref={scrollContainerRef}>
          <Parallax
            bgImage={fundoImagens['aura.jpg']}
            strength={200}
            style={{ height: '100vh', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
          >
          </Parallax>
          <Gallery images={images} openModal={openModal} />
          <Parallax
            bgImage={fundoImagens['fundo1.png']}
            strength={200}
            style={{ height: '100vh', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
          >
          </Parallax>
        </div>
      </main>
      <Modal
        image={modalOpen ? currentImage : null}
        closeModal={closeModal}
        caption={caption}
        changeSlide={changeSlide}
      />
    </div>
  );
}

export default App;
