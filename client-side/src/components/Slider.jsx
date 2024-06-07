// Images
import banner01 from "../assets/banner_01.png";
import banner02 from "../assets/banner_02.jpg";
import banner03 from "../assets/banner_03.jpg";

const Slider = () => {
  return (
    <div>
      <swiper-container
        class="mySwiper"
        pagination="true"
        pagination-clickable="true"
        navigation="true"
        space-between="30"
        centered-slides="true"
        autoplay-delay="3000"
        autoplay-disable-on-interaction="false"
      >
        <swiper-slide>
          <div className="relative">
            <img
              src={banner01}
              alt="Banner Image"
              className="w-full max-h-[500px]"
            />
            <h3 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:text-2xl md:text-3xl font-bold font-lato p-4 text-center bg-black/50 text-white">
            Diversify Your Choices, Explore Alternatives
            </h3>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div className="relative">
            <img
              src={banner02}
              alt="Banner Image"
              className="w-full max-h-[500px]"
            />
            <h3 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:text-2xl md:text-3xl font-bold font-lato p-4 text-center bg-black/50 text-white">
              Discover New Options, Make Conscious Decisions
            </h3>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div className="relative">
            <img
              src={banner03}
              alt="Banner Image"
              className="w-full max-h-[500px]"
            />
            <h3 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:text-2xl md:text-3xl font-bold font-lato p-4 text-center bg-black/50 text-white">
            Challenge Tradition, Adopt New Alternatives
            </h3>
          </div>
        </swiper-slide>
      </swiper-container>
    </div>
  );
};

export default Slider;
