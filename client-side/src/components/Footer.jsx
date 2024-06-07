import { Footer } from "flowbite-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa6";

const FooterComponent = () => {
  return (
    <Footer className="rounded-none" container>
      <div className="w-full text-center">
        <div className="w-full flex flex-col justify-between items-center sm:flex-row">
          <Footer.Brand
            href="https://alternative-seek.surge.sh"
            src="/logo.jpg"
            alt="Alternative Seek Logo"
            name="Alternative Seek"
          />
          <Footer.LinkGroup className="text-2xl">
            <Footer.Link href="#">
              <FaFacebook />
            </Footer.Link>
            <Footer.Link href="#">
              <FaLinkedin />
            </Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="Alternative Seek" year={2024} />
      </div>
    </Footer>
  );
};

export default FooterComponent;
