import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

function ShippingForm({setShippingFormValid}) {
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
  });

  const router = useRouter();

  const validateForm = (e) => {
    e.preventDefault()
    setShippingFormValid(true)
    router.push("/cart?step=3", { scroll: false });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={validateForm}>
      {/* FIELD */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-gray-500 font-medium">
          Jméno
        </label>
        <input
          type="text"
          id="name"
          placeholder="Jan Novák"
          className="border-b border-gray-200 outline-none text-sm"
        />
        {errors.name && <p className="text-xs text-red-500">Vyplňte jméno.</p>}
      </div>
      {/* FIELD */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-gray-500 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="novak@email.cz"
          className="border-b border-gray-200 outline-none text-sm"
        />
        {errors.name && <p className="text-xs text-red-500">Vyplňte jméno.</p>}
      </div>
      {/* FIELD */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-gray-500 font-medium">
          Telefon
        </label>
        <input
          type="text"
          id="phone"
          placeholder="123456789"
          className="border-b border-gray-200 outline-none text-sm"
        />
        {errors.name && <p className="text-xs text-red-500">Vyplňte jméno.</p>}
      </div>
      {/* FIELD */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-gray-500 font-medium">
          Adresa
        </label>
        <input
          type="text"
          id="adress"
          placeholder="Ulice, č.p., PSČ, město"
          className="border-b border-gray-200 outline-none text-sm"
        />
        {errors.name && <p className="text-xs text-red-500">Vyplňte jméno.</p>}
      </div>
      {/* BUTTON */}
      <button className="btn btn-icon btn-accent">
        Další <FaArrowRight className="w-3 h-3" />
      </button>
    </form>
  );
}

export default ShippingForm;
