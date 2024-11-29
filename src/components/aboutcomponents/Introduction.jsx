import React from "react";
import Slider from "react-slick";
import "./Introduction.css"; // Sửa lại tên file CSS

function Introduction() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  const introductions = [
    {
      content:
        "Tại Flower Exchange Website, chúng tôi cam kết mang đến những bông hoa tươi nhất từ những người trồng hoa và các cửa hàng hoa tốt nhất trên toàn quốc.",
    },
    {
      content:
        "Chúng tôi luôn nỗ lực để mang lại những sản phẩm và dịch vụ chất lượng cao, giúp bạn có thể chia sẻ niềm vui và tình yêu thông qua những bó hoa tuyệt đẹp.",
    },
    {
      content:
        "Dù bạn cần hoa cho những dịp lễ, sự kiện, hay chỉ đơn giản là để làm sáng không gian sống của mình, Flower Exchange luôn sẵn sàng đáp ứng nhu cầu của bạn.",
    },
    {
      content:
        "Mỗi bó hoa đều được chúng tôi chọn lọc kỹ càng, đảm bảo tươi lâu và mang lại niềm vui cho người nhận.",
    },
    {
      content:
        "Flower Exchange không chỉ cung cấp hoa, mà còn mang đến trải nghiệm khách hàng tuyệt vời với dịch vụ hỗ trợ 24/7.",
    },
    {
      content:
        "Chúng tôi tự hào mang đến những bó hoa tươi đẹp nhất để giúp bạn gửi gắm những thông điệp yêu thương đến những người thân yêu.",
    },
  ];

  return (
    <div className="about-introduction">
      <h2>Giới thiệu về chúng tôi</h2>
      <Slider {...settings}>
        {introductions.map((introduction, index) => (
          <div className="introduction-slide" key={index}>
            <p>{introduction.content}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Introduction;
