const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <h5 className="mb-3 text-white">
              <i className="bi bi-headphones me-2"></i>
              SoundHub
            </h5>
            <p className="text-light">
              Your premium destination for high-quality headphones and audio equipment.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="d-flex justify-content-md-end justify-content-start">
              <a href="#" className="text-light me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4 border-light" />
        <div className="text-center">
          <p className="mb-0 text-light">
            © 2024 SoundHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;