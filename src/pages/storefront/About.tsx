import { useSettingsStore } from '../../store/settings';
export default function About() {
  const { settings } = useSettingsStore();
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">About {settings.shopName}</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 prose prose-stone max-w-none">
          <p className="lead text-xl text-stone-600 mb-6">
            {settings.shopName} is a leading agro pharmacy in Nepal, dedicated to providing high-quality agricultural inputs and expert advice to farmers across the country.
          </p>
          <p>
            Established with a vision to revolutionize farming practices in Nepal, we offer a comprehensive range of products including certified seeds, organic and synthetic fertilizers, effective pesticides, and modern farming tools.
          </p>
          <p>
            Our team consists of agricultural experts who are passionate about empowering local farmers to achieve better yields and sustainable practices. We source our products from trusted national and international manufacturers, ensuring that every item on our shelves meets the highest standards of quality and safety.
          </p>
        </div>
      </div>
    </div>
  );
}
