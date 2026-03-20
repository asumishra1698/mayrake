"use client";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState("uk");
  const [isAboutExpanded, setIsAboutExpanded] = React.useState(false);

  // USA states for the lead form
  const states = React.useMemo(() => ([
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ]), []);

  const [selectedState, setSelectedState] = React.useState("");

  // Form fields for mailer
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [dialCode, setDialCode] = React.useState("1");
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [toast, setToast] = React.useState({ show: false, text: "" });
  const showToast = React.useCallback((text) => {
    setToast({ show: true, text });
    const t = setTimeout(() => setToast({ show: false, text: "" }), 3000);
    return () => clearTimeout(t);
  }, []);


  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    // Validate phone number
    const national = phone.replace(/\D/g, "").replace(new RegExp("^" + dialCode), "");
    if (national.length !== 10) {
      setSubmitting(false);
      showToast("❌ Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate name, email, and state
    if (!name.trim() || !email.trim() || !selectedState.trim()) {
      setSubmitting(false);
      showToast("❌ Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.startsWith("+") ? phone : `+${phone}`,
          state: selectedState.trim(),
        }),
      });

      // Handle 429 (rate limit) - plain text response
      if (res.status === 429) {
        showToast("⏳ Too many requests. Please wait 60 seconds before trying again.");
        setSubmitting(false);
        return;
      }

      // Try to parse JSON
      let data;
      try {
        data = await res.json();
      } catch {
        // If response is not JSON, handle as plain text error
        showToast("❌ Server error. Please try again later.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        if (res.status === 400) {
          showToast("❌ " + (data.error || "Invalid input. Please check your details."));
        } else if (res.status === 500) {
          showToast("❌ Server error. Please try again later.");
        } else {
          showToast("❌ " + (data.error || "Failed to submit. Please try again."));
        }
        setSubmitting(false);
        return;
      }

      // Success
      showToast("✅ Submitted! We will contact you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setSelectedState("");
    } catch (err) {
      console.error("Submission error:", err);
      showToast("❌ Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="relative min-h-screen">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-0 bg-[#fffffff8] bg-opacity-90 shadow-md z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div >
            <img src="https://mayrake.com/cdn/shop/files/Final_logo.png?v=1767330981&width=500" alt="Mayrake  Logo" className="h-14 w-auto mr-2" />
          </div>
          <div className="flex items-center gap-3">
            {/* Call icon button */}
            <a
              href="tel:8290806541"
              aria-label="Call us"
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-blue-50 transition"
              title="Call us"
            >
              <img src="https://gonardweb.com/wp-content/uploads/2023/09/call.png" alt="" srcSet="https://gonardweb.com/wp-content/uploads/2023/09/call.png" width="60" height="60" />
            </a>
            {/* WhatsApp icon button */}
            <a
              href="https://wa.me/918290806541"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex items-center justify-center w-10 h-10 rounded-full text-green-600 hover:bg-green-50 transition"
              title="Chat on WhatsApp"
            >
              <img src="https://gonardweb.com/wp-content/uploads/2023/09/whatsapp.png" alt="WhatsApp" srcSet="https://gonardweb.com/wp-content/uploads/2023/09/whatsapp.png" width="60" height="60" />
            </a>
          </div>
        </div>
      </header>

      <section className="relative min-h-[80vh] overflow-hidden py-20 mt-18">
        {/* Background Image (full width) */}
        <img src="./bg.jpg" alt="Delhi Hero" className="absolute inset-0 w-full h-full object-cover z-0" style={{ objectPosition: 'center' }} />
        {/* <div className="absolute inset-0 bg-black bg-opacity-40 z-10" /> */}
        <div className="container mx-auto relative z-20 px-4 flex flex-col md:flex-row items-center justify-center px-8 py-20 min-h-[80vh]">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center items-start md:items-start">
            <div className="py-12 md:py-0">
              <h1 className="text-white text-2xl md:text-5xl font-extrabold mb-6 drop-shadow-lg text-center md:text-left">Mayrake  - The Clothing Effect</h1>
              <ul className="text-white text-lg space-y-2 drop-shadow-lg">
                <li className="flex items-center"><span className="mr-2">✔️</span>Outfits for Every Occasion*</li>
                <li className="flex items-center"><span className="mr-2">✔️</span>Premium Quality Clothing*</li>
                <li className="flex items-center"><span className="mr-2">✔️</span>Premium Style at Affordable Prices*</li>
              </ul>
            </div>
          </div>
          {/* Right: Form */}
          <div className="flex-1 max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 mt-8 md:mt-0 md:ml-8 bg-opacity-95 z-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center leading-tight">Stay Updated with Mayrake Events</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="relative">
                <input type="text" placeholder="Enter Full Name*" className="w-full border border-gray-300 rounded-xl px-2 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer" required value={name} onChange={(e) => setName(e.target.value)} />
                <label className="absolute left-4 top-[-8px] bg-white px-1 text-xs text-gray-500 pointer-events-none peer-focus:text-blue-500">Name*</label>
              </div>
              <div className="relative">
                <input type="email" placeholder="Enter Email Address*" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="absolute left-4 top-[-8px] bg-white px-1 text-xs text-gray-500 pointer-events-none peer-focus:text-blue-500">Enter Email Address*</label>
              </div>
              <div className="relative">
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(val, data) => {
                    setPhone(val);
                    setDialCode((data && data.dialCode) || "91");
                  }}
                  isValid={(val, country) => {
                    const dc = (country && country.dialCode) || "";
                    const national = (val || "").replace(/\D/g, "").replace(new RegExp("^" + dc), "");
                    return national.length === 10 || "Enter 10-digit mobile number";
                  }}
                  inputProps={{ name: "phone", required: true, inputMode: "numeric" }}
                  placeholder="Mobile number*"
                  enableSearch
                  countryCodeEditable={false}
                  inputClass="w-full !text-md !border !border-gray-300 !rounded-r-xl focus:!outline-none focus:!ring-2 focus:!ring-blue-500"
                  containerClass="w-full"
                  buttonClass="!rounded-l-xl !border !border-gray-300"
                  inputStyle={{ height: '48px', padding: '0 45px', width: '100%' }}
                  buttonStyle={{ height: '48px' }}
                />
                <label className="absolute left-4 top-[-8px] bg-white px-1 text-xs text-gray-500 pointer-events-none">Mobile number*</label>
              </div>

              {/* State */}
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                >
                  <option value="">Select USA State</option>
                  {states.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <label className="absolute left-4 top-[-8px] bg-white px-1 text-xs text-gray-500 pointer-events-none">USA State*</label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4" defaultChecked />
                <span className="text-gray-600 text-base">I have read and agreed to <a href="#" className="text-blue-600 underline">terms</a> & <a href="#" className="text-blue-600 underline">privacy policy</a></span>
              </div>
              <button type="submit" className="w-full bg-blue-400 text-white font-bold py-2 rounded-xl mt-2 text-lg hover:bg-blue-500 transition" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
              {message && <div className="text-center text-sm mt-2">{message}</div>}
            </form>
          </div>
          {toast.show && (
            <div
              aria-live="polite"
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]"
            >
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm md:text-base">
                {toast.text}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Mayrake Section */}
      <section className="bg-[#fff] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold  text-center mb-12">
            Why Choose <span className="text-blue-500">Mayrake ?</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-4xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">🧵</span>
              <div className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-2">Premium <span className="font-normal">Fabrics & Finish</span></div>
            </div>
            <div>
              <span className="text-4xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">✨</span>
              <div className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-2">Curated <span className="font-normal">Styles for Every Occasion</span></div>
            </div>
            <div>
              <span className="text-4xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">💎</span>
              <div className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-2">Affordable <span className="font-normal">Luxury Looks</span></div>
            </div>
            <div>
              <span className="text-4xl mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">👗</span>
              <div className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-2">Elegant <span className="font-normal">Designs with Modern Appeal</span></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Fourth Section: Success Stories */}
      <section className="bg-[#fff] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-2">
            500+ <span className="text-blue-500">USA Women Success Stories</span>
          </h2>
          {/* <div className="text-gray-500 text-lg mb-10">From Dreamers to Achievers</div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Emily Carter" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Emily Carter</div>
                  <div className="text-gray-500 text-sm">Austin, Texas</div>
                </div>
              </div>
              <div className="text-gray-700 mb-2">I love how Mayrake outfits fit real life in the USA. The fabric feels premium, the cuts are flattering, and I can wear these looks from work to dinner without changing.</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Ethnic Wear</span>
                <img src="/fav.jpg" className="h-6 w-auto ml-auto" />
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Sophia Martin" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Sophia Martin</div>
                  <div className="text-gray-500 text-sm">Miami, Florida</div>
                </div>
              </div>
              <div className="text-gray-700 mb-2">As a busy mom, I needed stylish pieces that are easy to wear. Mayrake gave me exactly that. Every order arrived on time and looked even better than the photos.</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Ethnic Wear</span>
                <img src="/fav.jpg" alt="Queen Mary University of London" className="h-6 w-auto ml-auto" />
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Olivia Johnson" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Olivia Johnson</div>
                  <div className="text-gray-500 text-sm">Seattle, Washington</div>
                </div>
              </div>
              <div className="text-gray-700 mb-2">The quality is incredible and the stitching is beautiful. I have worn my Mayrake dresses to events across Seattle and always get asked where I bought them.</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Ethnic Wear</span>
                <img src="/fav.jpg" alt="University of Illinois" className="h-6 w-auto ml-auto" />
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/21.jpg" alt="Ava Thompson" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Ava Thompson</div>
                  <div className="text-gray-500 text-sm">New York, New York</div>
                </div>
              </div>
              <div className="text-gray-700 mb-2">Mayrake helped me build a capsule wardrobe that looks polished and feminine. It is now my first choice for office-ready outfits in New York.</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Ethnic Wear</span>
                <img src="/fav.jpg" alt="Central Michigan University" className="h-6 w-auto ml-auto" />
              </div>
            </div>
            {/* Card 5 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/53.jpg" alt="Mia Rodriguez" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Mia Rodriguez</div>
                  <div className="text-gray-500 text-sm">Los Angeles, California</div>
                </div>
              </div>
              <div className="text-gray-700 mb-2">I wanted bold looks with comfort, and Mayrake delivered. The colors, silhouettes, and fit are perfect for California weather and weekend plans.</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Ethnic Wear</span>
                <img src="/fav.jpg" alt="BSBI" className="h-6 w-auto ml-auto" />
              </div>
            </div>
            {/* Card 6 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Charlotte Davis" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Charlotte Davis</div>
                  <div className="text-gray-500 text-sm">Chicago, Illinois</div>
                </div>
              </div>
              <div className="text-gray-700 mb-2">From brunch outfits to formal looks, everything I purchased from Mayrake feels thoughtfully designed. It is rare to find this quality and value in one brand.</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Ethnic Wear</span>
                <img src="/fav.jpg" alt="Humber" className="h-6 w-auto ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Fifth Section: About Mayrake */}
      <section className="bg-[#f6fbff] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-4xl font-extrabold mb-8">
            About <span className="text-blue-500">Mayrake </span>
          </h2>
          <div className="bg-white rounded-2xl shadow p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-lg text-gray-600">
                At Mayrake, we are dedicated to offering a harmonious blend of ethnic and contemporary fashion wear, inspired by Indian heritage and global style trends - all at budget-friendly prices. Our apparel reflects a unique balance of traditional craftsmanship and modern design, curated for individuals who value elegance, quality, and cultural authenticity.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Name Origin</h3>
              <p className="text-lg text-gray-600">
                The name "MAYRAKE" is inspired by two elements: my daughter's name, Mayra, and the Japanese word "Meraki", which means "soul, creativity, or love." This fusion perfectly captures the heart of my dream project.
              </p>
            </div>

            {isAboutExpanded && (
              <>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Founder</h3>
                  <p className="text-xl font-semibold text-gray-900 mb-2">Priyanka Priyadarshini</p>
                  <p className="text-lg text-gray-600">
                    Since childhood, I dreamt of creating fashion. I envisioned clothes and accessories even before I had the means to make them. Encouraged to pursue a technical career, I spent 13 years in IT after completing my engineering degree. Yet, my passion for fashion remained constant, eventually inspiring me to turn my lifelong dream into reality.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Vision</h3>
                  <p className="text-lg text-gray-600">
                    Mayrake was built on the vision of allowing people around the world to embrace India's handloom legacy - from Banarasi sarees to intricate handcrafted embroidery. Our mission is to bring a fusion of tradition and modern design to a diverse audience, while ensuring high-quality garments for every occasion.
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="text-blue-600 font-semibold hover:underline text-lg focus:outline-none mt-6 block ml-auto"
            onClick={() => setIsAboutExpanded((prev) => !prev)}
            aria-expanded={isAboutExpanded}
          >
            {isAboutExpanded ? "Read less ..." : "Read more ..."}
          </button>
        </div>
      </section>
      {/* Founder Notes Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-10">
            <span className="text-blue-500">Founder's</span> Note
          </h2>
          <div className="flex flex-col items-center max-w-full mx-auto bg-[#f6fbff] rounded-2xl shadow-md p-8">
            {/* Founder Image Top Centered Circle */}
            <div className="flex justify-center mb-6">
              <img
                src="https://scontent.fdel1-7.fna.fbcdn.net/v/t39.30808-6/464148595_122093681102593341_7521620546675822904_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=UUcd1Qoj6csQ7kNvwEWuO_1&_nc_oc=Ado2OZjbV0Q3utNuQNxJJCA40gVxd_AQdmMu2-PMDElhAx5gOZUJIXiLST-CXree_9xHW7vHkXRWr32IqNXKwFj_&_nc_zt=23&_nc_ht=scontent.fdel1-7.fna&_nc_gid=IrHxdnGF1of8-kLlrW2ssA&_nc_ss=7a30f&oh=00_AfwkAwdmTb9ECdIO9AJ0Ms_N3IIJABK7pff9y-vDsTAtvA&oe=69C2B180"
                alt="Founder"
                className="rounded-full shadow-lg w-40 h-40 object-cover border-4 border-blue-100"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center">Priyanka Priyadarshini</h3>
            <div className="text-blue-600 font-semibold mb-4 text-center">Founder</div>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-4">
              Since childhood, I dreamt of creating fashion. I imagined clothing and accessories long before I had the means to bring them to life. Though I pursued engineering and spent 13 years in IT, my passion for design never faded.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Mayrake is my dream project - a brand built to celebrate Indian heritage with a modern global outlook. Through every collection, we aim to offer elegant, high-quality, and budget-friendly fashion that helps people express their identity with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Videos Slider */}
      <section className="bg-[#f6fbff] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-10">
            <span className="text-blue-500">Influencer</span> Videos
          </h2>
          <div className="relative">
            <div id="video-slider" className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2" style={{ scrollbarWidth: 'none' }}>
              {["https://www.youtube.com/embed/qNmwcKtu31s", "https://www.youtube.com/embed/wY8hBYfo_P4", "https://www.youtube.com/embed/OXi6bf3_c3M", "https://www.youtube.com/embed/WOrqrKwxU6Y", "https://www.youtube.com/embed/JAh9kMXiU5c"].map((src, i) => (
                <div key={i} className="min-w-[80%] sm:min-w-[48%] md:min-w-[24%] bg-white rounded-xl shadow-lg overflow-hidden snap-center">
                  <iframe
                    width="100%"
                    height="400"
                    src={src}
                    title={`YouTube video ${i + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button type="button" aria-label="Previous" className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50" onClick={() => {
                const el = document.getElementById('video-slider');
                if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
              }}>Prev</button>
              <button type="button" aria-label="Next" className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50" onClick={() => {
                const el = document.getElementById('video-slider');
                if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
              }}>Next</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 pt-8 pb-0">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <img src="https://mayrake.com/cdn/shop/files/Final_logo.png?v=1767330981&width=500" alt="Mayrake Logo" className="h-auto mb-0 w-[200px]" />
            {/* <div className="text-gray-500 text-lg mb-2">A plan for every dream</div>cls */}
          </div>
          <div className="flex flex-col md:items-end gap-2 md:gap-4">
            <a href="#" className="text-gray-500 text-lg hover:underline">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-lg hover:underline">Terms & Conditions</a>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-gray-500 text-lg mb-1">Copyright © 2026, Mayrake</div>
          <div className="text-gray-500 text-lg">All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
