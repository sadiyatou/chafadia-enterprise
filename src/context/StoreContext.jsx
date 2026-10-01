import { createContext, useContext, useEffect, useMemo, useState } from "react";
// Dresses
import dress from "../assets/images/dress.jpg";
import dress0 from "../assets/images/dress0.jpg";
import dress1 from "../assets/images/dress1.jpg";
import dress2 from "../assets/images/dress2.jpg";
import dress3 from "../assets/images/dress3.jpg";
import dress4 from "../assets/images/dress4.jpg";
import dress5 from "../assets/images/dress5.jpg";
import dress6 from "../assets/images/dress6.jpg";
import dress7 from "../assets/images/dress7.jpg";
import dress8 from "../assets/images/dress8.jpg";
import dress9 from "../assets/images/dress9.jpg";
import dress10 from "../assets/images/dress10.jpg";
import dress11 from "../assets/images/dress11.jpg";
import dress12 from "../assets/images/dress12.jpg";
import dress13 from "../assets/images/dress13.jpg";
import dress14 from "../assets/images/dress14.jpg";
import dress15 from "../assets/images/dress15.jpg";
import dress16 from "../assets/images/dress16.jpg";
import dress17 from "../assets/images/dress17.jpg";
import dress18 from "../assets/images/dress18.jpg";
import dress19 from "../assets/images/dress19.jpg";
import dress20 from "../assets/images/dress20.jpg";
import dress21 from "../assets/images/dress21.jpg";

// Hand bags
import handBag1 from "../assets/images/hand-bag1.jpg";
import handBag2 from "../assets/images/hand-bag2.jpg";
import handBag3 from "../assets/images/hand-bag3.jpg";
import handBag4 from "../assets/images/hand-bag4.jpg";
import handBag5 from "../assets/images/hand-bag5.jpg";
import handBag6 from "../assets/images/hand-bag6.jpg";
import handBag7 from "../assets/images/hand-bag7.jpg";
import handBag8 from "../assets/images/hand-bag8.jpg";
import handBag9 from "../assets/images/hand-bag9.jpg";
import handBag10 from "../assets/images/hand-bag10.jpg";
import handBag11 from "../assets/images/hand-bag11.jpg";
import handBag12 from "../assets/images/hand-bag12.jpg";

// Shoes
import shoes from "../assets/images/shoes.jpg";
import shoes0 from "../assets/images/shoes0.jpg";
import shoes2 from "../assets/images/shoes2.jpg";
import shoes3 from "../assets/images/shoes3.jpg";
import shoes4 from "../assets/images/shoes4.jpg";
import shoes5 from "../assets/images/shoes5.jpg";
import shoes6 from "../assets/images/shoes6.jpg";
import shoes7 from "../assets/images/shoes7.jpg";
import shoes8 from "../assets/images/shoes8.jpg";
import shoes9 from "../assets/images/shoes9.jpg";
import shoes10 from "../assets/images/shoes10.jpg";
import shoes11 from "../assets/images/shoes11.jpg";
import shoes12 from "../assets/images/shoes12.jpg";
import shoes13 from "../assets/images/shoes13.jpg";
import shoes14 from "../assets/images/shoes14.jpg";
import shoes15 from "../assets/images/shoes15.jpg";
import shoes16 from "../assets/images/shoes16.jpg";

// Jewelry & beauty
import jewelry1 from "../assets/images/jewelry1.jpg";
import jewelry2 from "../assets/images/jewelry2.jpg";
import jewelry3 from "../assets/images/jewelry3.jpg";
import jewelry4 from "../assets/images/jewelry4.jpg";
import lipGlose from "../assets/images/lip-glose.jpg";

// Chips
import bananaChips1 from "../assets/images/banana-chips1.png";
import bananaChips2 from "../assets/images/banana-chips2.png";
import bananaSpicy1 from "../assets/images/banana-spicy1.png";
import bananaSpicy2 from "../assets/images/banana-spicy2.png";
import beefChips1 from "../assets/images/beef-chips1.png";
import beefChips2 from "../assets/images/beef-chips2.png";
import beefSpicy from "../assets/images/beef-spicy 1.png";
import chickenChips1 from "../assets/images/chicken-chips1.png";
import chickenChips2 from "../assets/images/chicken-chips2.png";
import chickenSpicy1 from "../assets/images/chicken-spicy1.png";
import chickenSpicy2 from "../assets/images/chicken-spicy2.png";
import chipsFlyer from "../assets/images/chips.png";
import potatoChips1 from "../assets/images/potato-chips1.png";
import potatoChips2 from "../assets/images/potato-chips2.png";
import potatoSpicy1 from "../assets/images/potato-spicy1.png";
import potatoSpicy2 from "../assets/images/potato-spicy2.png";

// Cleaning, hygiene, food essentials
import redVinegar from "../assets/images/red-vinegar.png";
import tileWash1 from "../assets/images/tile-wash1.png";
import vinegar2 from "../assets/images/vinegar2.png";
import bathJel from "../assets/images/bath-jel.png";
import bathJel1 from "../assets/images/bath-jel1.png";
import bicarbonate1 from "../assets/images/bicarbonate1.png";
import bicarbonate2 from "../assets/images/bicarbonate2.png";
import eauDejavel from "../assets/images/eau-dejavel.png";
import glycerine1 from "../assets/images/glycerine1.png";
import familySkincare from "../assets/images/family-skincare.png";
import familySkincare2 from "../assets/images/family-skincare2.png";
import femineSecrets from "../assets/images/femine-secrets.png";
import dishesSavon from "../assets/images/dishes-savon.png";
import liquidSoap from "../assets/images/liquid-soap.png";

// Halal drinks
import boabab from "../assets/images/boabab.png";
import carrotBeetroot from "../assets/images/carrot-beetroot.png";
import carrotJuice from "../assets/images/carrot-juice.png";
import cocktailDrink from "../assets/images/cocktail-drink.png";
import mangoJuice from "../assets/images/mango-juice.png";
import orangeJuice from "../assets/images/orange-juice.png";
import pineappleGinger from "../assets/images/pineaple-ginger.png";
import pineappleCucumber from "../assets/images/pineaple-cucumber.png";

// Pallets
import pallets1 from "../assets/images/pallets1.png";
import pallets2 from "../assets/images/pallets2.png";

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  products: "products",
  cart: "cart",
  orders: "orders",
  notifications: "notifications",
  wishlist: "wishlist",
  compare: "compare",
  reviews: "reviews",
  recentlyViewed: "recentlyViewed",
};

const safeParse = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Failed to read ${key}`, error);
    return fallback;
  }
};

const generateId = () => Date.now() + Math.floor(Math.random() * 100000);
const cleanNumber = (value) => Number(value || 0);
const formatReceiptNo = () => `CHF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
const formatMoney = (amount) => `${cleanNumber(amount).toLocaleString()} FCFA`;

const createProduct = ({
  id,
  name,
  price,
  category,
  collection = "",
  stock,
  image,
  secondImage = "",
  gallery = [],
  description,
  status = "Available",
  featured = false,
  discount = 0,
  badge = "Premium",
  variants = ["Standard"],
  rating = 5,
  costPrice = 0,
  supplier = "",
  sku = "",
}) => ({
  id,
  name,
  price: cleanNumber(price),
  category,
  collection,
  stock: cleanNumber(stock),
  image,
  secondImage,
  gallery: gallery.length ? gallery : [image, secondImage].filter(Boolean),
  description,
  status: cleanNumber(stock) <= 0 ? "Out of Stock" : status,
  featured,
  discount: cleanNumber(discount),
  badge,
  variants,
  rating: cleanNumber(rating),
  costPrice: cleanNumber(costPrice),
  supplier,
  sku: sku || `CHF-PROD-${String(id).replace(/\D/g, "") || Date.now().toString().slice(-5)}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const dressImages = [dress, dress0, dress1, dress2, dress3, dress4, dress5, dress6, dress7, dress8, dress9, dress10, dress11, dress12, dress13, dress14, dress15, dress16, dress17, dress18, dress19, dress20, dress21];
const handBagImages = [handBag1, handBag2, handBag3, handBag4, handBag5, handBag6, handBag7, handBag8, handBag9, handBag10, handBag11, handBag12];
const shoeImages = [shoes, shoes0, shoes2, shoes3, shoes4, shoes5, shoes6, shoes7, shoes8, shoes9, shoes10, shoes11, shoes12, shoes13, shoes14, shoes15, shoes16];

const dressPriceMap = {
  1: 13000,
  3: 25000,
  6: 20000,
  8: 30000,
  9: 14000,
  11: 50000,
  12: 10000,
  14: 25000,
  15: 21000,
  20: 16000,
  21: 19000,
  22: 23000,
};

const defaultDressPrices = [
  13000, 12000, 25000, 15000, 17000, 20000, 18000, 30000,
  14000, 18000, 50000, 10000, 16000, 25000, 21000, 15000,
  17000, 18000, 15000, 16000, 19000, 23000,
];

const getDressPrice = (number) => {
  if (dressPriceMap[number]) return dressPriceMap[number];
  return defaultDressPrices[number - 1] || 15000;
};

const getDressDescription = (number) => {
  if (number === 1) {
    return "Elegant modest dress for classy occasions. Single price: 13,000 FCFA. Bridesmaids or multiple-girls order: 10,000 FCFA each.";
  }

  if (number === 11) {
    return "Premium modest dress package. Price: 50,000 FCFA for the two dresses shown together.";
  }

  return "Elegant modest dress selected for beauty, comfort, confidence and premium feminine style.";
};

const getDressVariants = (number) => {
  if (number === 1) {
    return [
      "Single Dress - 13,000 FCFA",
      "Bridesmaids / Multiple Girls - 10,000 FCFA each",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ];
  }

  if (number === 11) {
    return ["Two Dresses Set - 50,000 FCFA", "S", "M", "L", "XL", "XXL"];
  }

  return ["S", "M", "L", "XL", "XXL"];
};

const defaultProducts = [
  ...dressImages.map((image, index) => {
    const number = index + 1;

    return createProduct({
      id: `dress-${number}`,
      name: `Elegant Modest Dress ${number}`,
      price: getDressPrice(number),
      category: "Feminine Secrets",
      collection: "Elegant Dresses",
      stock: 8 + (index % 7),
      image,
      secondImage: dressImages[(index + 1) % dressImages.length],
      gallery: [image, dressImages[(index + 1) % dressImages.length], dressImages[(index + 2) % dressImages.length]],
      description: getDressDescription(number),
      featured: index < 8,
      discount: 0,
      badge: number === 1 ? "Bulk Price" : number === 11 ? "Two Dresses" : index < 6 ? "New Arrival" : "Elegant",
      variants: getDressVariants(number),
    });
  }),
  ...handBagImages.map((image, index) => {
    const number = index + 1;
    const handBagPriceMap = {
      1: 11500,
      2: 10000,
      3: 6000,
      5: 5000,
      6: 9500,
      7: 8000,
      8: 7500,
      9: 10000,
    };
    const defaultHandBagPrices = [11500, 10000, 6000, 7500, 5000, 9500, 8000, 7500, 10000, 8500, 9000, 9500];

    return createProduct({
      id: `handbag-${number}`,
      name: `Premium Hand Bag ${number}`,
      price: handBagPriceMap[number] || defaultHandBagPrices[index] || 8000,
      category: "Feminine Secrets",
      collection: "Hand Bags",
      stock: 7 + (index % 5),
      image,
      secondImage: handBagImages[(index + 1) % handBagImages.length],
      gallery: [image, handBagImages[(index + 1) % handBagImages.length], handBagImages[(index + 2) % handBagImages.length]],
      description: "Beautiful handbag for elegant women, daily use, events, gifting and professional style.",
      featured: index < 5,
      discount: 0,
      badge: "Luxury Bag",
      variants: ["Classic", "Luxury", "Gift Pack"],
    });
  }),
  ...shoeImages.map((image, index) => {
    const shoePrices = [
      8500, 9000, 9500, 10000, 10500, 11000, 9000, 9500, 10000,
      11000, 11500, 12000, 10000, 10500, 11000, 12000, 13000,
    ];

    return createProduct({
      id: `shoes-${index + 1}`,
      name: `Elegant Footwear ${index + 1}`,
      price: shoePrices[index] || 10000,
      category: "Feminine Secrets",
      collection: "Shoes & Footwear",
      stock: 7 + (index % 6),
      image,
      secondImage: shoeImages[(index + 1) % shoeImages.length],
      gallery: [image, shoeImages[(index + 1) % shoeImages.length], shoeImages[(index + 2) % shoeImages.length]],
      description: "Elegant footwear for classy outfits, occasions, office wear and everyday confidence.",
      featured: index < 6,
      discount: 0,
      badge: "Classy Footwear",
      variants: ["36", "37", "38", "39", "40", "41"],
    });
  }),
  createProduct({ id: "jewelry-1", name: "Premium Jewelry Set 1", price: 5000, category: "Feminine Secrets", collection: "Jewelry", stock: 10, image: jewelry1, secondImage: jewelry2, gallery: [jewelry1, jewelry2, jewelry3, jewelry4], description: "Premium jewelry accessory for elegant dressing, gifts and special occasions.", featured: true, discount: 5, badge: "Luxury Jewelry", variants: ["Gold Tone", "Silver Tone"] }),
  createProduct({ id: "jewelry-2", name: "Premium Jewelry Set 2", price: 5500, category: "Feminine Secrets", collection: "Jewelry", stock: 10, image: jewelry2, secondImage: jewelry3, gallery: [jewelry2, jewelry3, jewelry4], description: "Beautiful jewelry piece designed to complete your modest and elegant outfit.", featured: true, badge: "Gift Choice", variants: ["Classic", "Luxury"] }),
  createProduct({ id: "jewelry-3", name: "Premium Jewelry Set 3", price: 6000, category: "Feminine Secrets", collection: "Jewelry", stock: 10, image: jewelry3, secondImage: jewelry4, gallery: [jewelry3, jewelry4, jewelry1], description: "Classy jewelry for women who love elegance, beauty and premium finishing.", featured: true, badge: "Elegant", variants: ["Classic", "Luxury"] }),
  createProduct({ id: "jewelry-4", name: "Premium Jewelry Set 4", price: 6500, category: "Feminine Secrets", collection: "Jewelry", stock: 8, image: jewelry4, secondImage: jewelry1, gallery: [jewelry4, jewelry1, jewelry2], description: "Elegant jewelry accessory suitable for parties, daily elegance and gifting.", featured: true, badge: "Premium", variants: ["Classic", "Luxury"] }),
  createProduct({ id: "lip-gloss", name: "Premium Lip Gloss", price: 2000, category: "Feminine Secrets", collection: "Beauty Care", stock: 25, image: lipGlose, gallery: [lipGlose], description: "Beautiful lip gloss for a soft, elegant and confident feminine finish.", featured: true, badge: "Beauty Care", variants: ["Clear", "Soft Pink", "Nude"] }),

  createProduct({ id: "banana-chips", name: "Banana Chips", price: 500, category: "Crips Co.", collection: "Non Spicy Chips", stock: 40, image: bananaChips1, secondImage: bananaChips2, gallery: [bananaChips1, bananaChips2], description: "Crispy banana chips with front and back packaging, perfect for family snacks and resale.", featured: true, badge: "Crunchy", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "spicy-banana-chips", name: "Spicy Banana Chips", price: 500, category: "Crips Co.", collection: "Spicy Chips", stock: 35, image: bananaSpicy1, secondImage: bananaSpicy2, gallery: [bananaSpicy1, bananaSpicy2], description: "Crunchy spicy banana chips with delicious seasoning and beautiful packaging.", featured: true, discount: 5, badge: "Spicy", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "beef-chips", name: "Beef Chips", price: 500, category: "Crips Co.", collection: "Meat Chips", stock: 28, image: beefChips1, secondImage: beefChips2, gallery: [beefChips1, beefChips2], description: "Non-spicy beef chips made for premium snacking, protein lovers and special treats.", featured: true, badge: "Protein Snack", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "spicy-beef-chips", name: "Spicy Beef Chips", price: 500, category: "Crips Co.", collection: "Meat Chips", stock: 20, image: beefSpicy, gallery: [beefSpicy], description: "Spicy beef chips with rich flavor for customers who love crunchy hot snacks.", featured: true, badge: "Spicy Meat", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "chicken-chips", name: "Chicken Chips", price: 500, category: "Crips Co.", collection: "Meat Chips", stock: 30, image: chickenChips1, secondImage: chickenChips2, gallery: [chickenChips1, chickenChips2], description: "Non-spicy chicken chips with front and back packaging for premium snacking.", featured: true, badge: "Chicken Snack", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "spicy-chicken-chips", name: "Spicy Chicken Chips", price: 500, category: "Crips Co.", collection: "Meat Chips", stock: 26, image: chickenSpicy1, secondImage: chickenSpicy2, gallery: [chickenSpicy1, chickenSpicy2], description: "Spicy chicken chips with beautiful front and back packaging for crunchy enjoyment.", featured: true, badge: "Hot Seller", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "potato-chips", name: "Potato Chips", price: 500, category: "Crips Co.", collection: "Potato Chips", stock: 45, image: potatoChips1, secondImage: potatoChips2, gallery: [potatoChips1, potatoChips2], description: "Crispy potato chips for daily snacks, school packs, family treats and occasions.", featured: true, badge: "Family Snack", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "spicy-potato-chips", name: "Spicy Potato Chips", price: 500, category: "Crips Co.", collection: "Potato Chips", stock: 38, image: potatoSpicy1, secondImage: potatoSpicy2, gallery: [potatoSpicy1, potatoSpicy2], description: "Spicy potato chips with crunchy texture and a delicious premium taste.", featured: true, badge: "Spicy", variants: ["Small Pack", "Family Pack", "Wholesale"] }),
  createProduct({ id: "chips-occasion-pack", name: "Chafadia Chips Occasion Pack", price: 5000, category: "Crips Co.", collection: "Occasion Packs", stock: 20, image: chipsFlyer, gallery: [chipsFlyer, bananaChips1, potatoChips1, chickenChips1], description: "Chafadia Enterprise chips package for occasions, schools, events, family gatherings and resale.", featured: true, discount: 10, badge: "Event Pack", variants: ["Event Pack", "Wholesale Pack", "Custom Pack"] }),

  createProduct({ id: "red-vinegar", name: "Red Vinegar", price: 1500, category: "Cleaning & Hygiene", collection: "Food Essentials", stock: 25, image: redVinegar, description: "Quality vinegar for food essentials, household use and Chafadia premium care.", featured: true, badge: "Food Essential", variants: ["500ml", "1L", "Wholesale"] }),
  createProduct({ id: "tile-wash", name: "Tile Wash", price: 2500, category: "Cleaning & Hygiene", collection: "Home Cleaning", stock: 35, image: tileWash1, description: "Powerful tile wash for clean, fresh and beautiful home surfaces.", featured: true, badge: "Home Care", variants: ["500ml", "1L", "5L"] }),
  createProduct({ id: "white-vinegar", name: "White Vinegar", price: 1500, category: "Cleaning & Hygiene", collection: "Food Essentials", stock: 25, image: vinegar2, description: "Versatile vinegar for food, home cleaning and daily household essentials.", featured: true, badge: "Essential", variants: ["500ml", "1L", "Wholesale"] }),
  createProduct({ id: "bath-gel", name: "Bath Gel", price: 2500, category: "Cleaning & Hygiene", collection: "Body Care", stock: 30, image: bathJel, secondImage: bathJel1, gallery: [bathJel, bathJel1], description: "Refreshing bath gel for everyday clean, smooth and pleasant body care.", featured: true, badge: "Body Care", variants: ["500ml", "1L", "Family Size"] }),
  createProduct({ id: "bicarbonate", name: "Bicarbonate", price: 1200, category: "Cleaning & Hygiene", collection: "Home Essentials", stock: 40, image: bicarbonate1, secondImage: bicarbonate2, gallery: [bicarbonate1, bicarbonate2], description: "Bicarbonate for food essentials, hygiene, home care and practical daily uses.", featured: true, badge: "Multi-purpose", variants: ["Small Pack", "Large Pack", "Wholesale"] }),
  createProduct({ id: "eau-de-javel", name: "Eau de Javel", price: 1500, category: "Cleaning & Hygiene", collection: "Home Cleaning", stock: 45, image: eauDejavel, description: "Eau de javel for hygiene, cleaning, laundry and household disinfection.", featured: true, badge: "Hygiene", variants: ["500ml", "1L", "5L"] }),
  createProduct({ id: "glycerine", name: "Glycerine", price: 2000, category: "Cleaning & Hygiene", collection: "Body Care", stock: 30, image: glycerine1, description: "Quality glycerine for body care, softness and everyday beauty essentials.", featured: true, badge: "Skin Care", variants: ["Small", "Medium", "Large"] }),
  createProduct({ id: "family-skincare", name: "Family Skincare Pack", price: 6500, category: "Cleaning & Hygiene", collection: "Family Care", stock: 20, image: familySkincare, secondImage: familySkincare2, gallery: [familySkincare, familySkincare2], description: "Family skincare essentials for clean, smooth and well-cared-for skin.", featured: true, discount: 7, badge: "Family Care", variants: ["Starter Pack", "Family Pack"] }),
  createProduct({ id: "feminine-care-pack", name: "Feminine Secrets Care Pack", price: 7500, category: "Cleaning & Hygiene", collection: "Women Essentials", stock: 18, image: femineSecrets, description: "Women essential care pack crafted for feminine confidence, hygiene and elegance.", featured: true, discount: 8, badge: "Women Care", variants: ["Classic Pack", "Premium Pack"] }),
  createProduct({ id: "dishes-savon", name: "Dishes Savon", price: 1500, category: "Cleaning & Hygiene", collection: "Dish Care", stock: 50, image: dishesSavon, description: "Dish soap for plates, kitchen utensils and everyday household cleaning.", featured: true, badge: "Kitchen Care", variants: ["500ml", "1L", "5L"] }),
  createProduct({ id: "liquid-soap", name: "Liquid Soap", price: 1800, category: "Cleaning & Hygiene", collection: "Home Hygiene", stock: 50, image: liquidSoap, description: "Liquid soap for handwashing, hygiene and premium family cleanliness.", featured: true, badge: "Hygiene", variants: ["500ml", "1L", "5L"] }),

  createProduct({ id: "baobab-drink", name: "Baobab Drink", price: 1500, category: "Halal Drinks", collection: "Natural Drinks", stock: 35, image: boabab, description: "Creamy baobab halal drink, refreshing and naturally satisfying.", featured: true, badge: "Natural Drink", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "carrot-beetroot-drink", name: "Carrot & Beetroot Drink", price: 1500, category: "Halal Drinks", collection: "Natural Drinks", stock: 35, image: carrotBeetroot, description: "Healthy carrot and beetroot drink for natural refreshment and wellness.", featured: true, badge: "Healthy", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "carrot-juice", name: "Carrot Juice", price: 1500, category: "Halal Drinks", collection: "Natural Drinks", stock: 35, image: carrotJuice, description: "Fresh carrot juice prepared for halal refreshment and family enjoyment.", featured: true, badge: "Fresh", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "cocktail-drink", name: "Cocktail Drink", price: 1800, category: "Halal Drinks", collection: "Natural Drinks", stock: 30, image: cocktailDrink, description: "Delicious cocktail drink blended for occasions, family events and daily refreshment.", featured: true, discount: 5, badge: "Event Drink", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "mango-juice", name: "Mango Juice", price: 1500, category: "Halal Drinks", collection: "Natural Drinks", stock: 40, image: mangoJuice, description: "Sweet mango juice with premium flavor for family refreshment.", featured: true, badge: "Fresh Juice", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "orange-juice", name: "Orange Juice", price: 1500, category: "Halal Drinks", collection: "Natural Drinks", stock: 40, image: orangeJuice, secondImage: mangoJuice, gallery: [orangeJuice, mangoJuice, cocktailDrink], description: "Fresh orange juice prepared for healthy halal refreshment.", featured: true, badge: "Fresh Juice", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "pineapple-ginger", name: "Pineapple & Ginger Drink", price: 1800, category: "Halal Drinks", collection: "Natural Drinks", stock: 30, image: pineappleGinger, description: "Pineapple and ginger drink with refreshing natural taste.", featured: true, badge: "Refreshing", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "pineapple-cucumber", name: "Pineapple & Cucumber Drink", price: 1800, category: "Halal Drinks", collection: "Natural Drinks", stock: 30, image: pineappleCucumber, description: "Refreshing pineapple and cucumber drink for halal wellness and hydration.", featured: true, badge: "Hydrating", variants: ["Small", "Medium", "Event Pack"] }),
  createProduct({ id: "occasion-pallets", name: "Occasion Pallets & Bulk Orders", price: 25000, category: "Wholesale & Occasions", collection: "Event Supply", stock: 20, image: pallets1, secondImage: pallets2, gallery: [pallets1, pallets2, chipsFlyer, cocktailDrink], description: "We offer pallets, bulk supply and occasion packages for weddings, parties, schools, businesses and special events. Nationwide and worldwide delivery available.", featured: true, discount: 12, badge: "Bulk Supply", variants: ["Small Occasion", "Large Occasion", "Wholesale", "Worldwide"] }),
];

const luxuryCollections = [
  { id: "dresses", title: "Elegant Dresses", category: "Feminine Secrets", text: "Modest, classy and beautiful styles for women who love elegance.", image: dress8, count: dressImages.length },
  { id: "bags", title: "Hand Bags & Accessories", category: "Feminine Secrets", text: "Premium bags, jewelry and beauty accessories to complete every look.", image: handBag6, count: handBagImages.length + 5 },
  { id: "shoes", title: "Shoes & Footwear", category: "Feminine Secrets", text: "Elegant footwear for office, occasions and daily confidence.", image: shoes10, count: shoeImages.length },
  { id: "chips", title: "Chips & Snacks", category: "Crips Co.", text: "Banana, potato, beef and chicken chips in spicy and non-spicy options.", image: chipsFlyer, count: 9 },
  { id: "hygiene", title: "Cleaning & Hygiene", category: "Cleaning & Hygiene", text: "Liquid soaps, bath gel, tile wash, eau de javel, bicarbonate and more.", image: liquidSoap, count: 11 },
  { id: "drinks", title: "Halal Drinks", category: "Halal Drinks", text: "Natural juices, cocktail drinks, baobab and fresh halal refreshment.", image: cocktailDrink, count: 8 },
  { id: "pallets", title: "Occasions & Pallets", category: "Wholesale & Occasions", text: "Bulk orders for weddings, schools, events, resellers and worldwide delivery.", image: pallets1, count: 2 },
];

const theme = {
  brand: { name: "CHAFADIA ENTERPRISE", slogan: "Beauty. Wellness. Refreshment. Care.", delivery: "Nationwide & Worldwide Delivery" },
  colors: { royalBlue: "#004aad", deepBlue: "#001f4d", gold: "#d4af37", deepGold: "#b8860b", softGold: "#fff7d6", white: "#ffffff", offWhite: "#f8fbff", page: "#f6f8ff", text: "#001f4d", muted: "#667085", green: "#166534", red: "#991b1b", orange: "#92400e" },
  gradients: { blue: "linear-gradient(135deg, #004aad, #001f4d)", gold: "linear-gradient(135deg, #fff7d6, #d4af37, #b8860b)", page: "radial-gradient(circle at 8% 8%, rgba(212,175,55,0.24), transparent 28%), radial-gradient(circle at 90% 12%, rgba(0,74,173,0.16), transparent 30%), linear-gradient(135deg, #f6f8ff 0%, #ffffff 52%, #f7f9ff 100%)" },
};

const styles = { page: { minHeight: "100vh", padding: "28px", background: theme.gradients.page }, container: { maxWidth: "1440px", margin: "0 auto" } };
const injectGlobalStyles = () => `
  :root { --chafadia-blue:${theme.colors.royalBlue}; --chafadia-deep-blue:${theme.colors.deepBlue}; --chafadia-gold:${theme.colors.gold}; --chafadia-text:${theme.colors.text}; --chafadia-muted:${theme.colors.muted}; }
  .chafadia-page{min-height:100vh;padding:28px;background:${theme.gradients.page};}
  .chafadia-container{max-width:1440px;margin:0 auto;}
  .chafadia-card{background:rgba(255,255,255,.985);border-radius:28px;border:1px solid rgba(212,175,55,.22);box-shadow:0 20px 50px rgba(0,31,77,.11);padding:20px;}
  .chafadia-btn{border:none;min-height:48px;padding:0 20px;border-radius:999px;background:${theme.gradients.blue};color:white;font-weight:950;cursor:pointer;transition:.3s ease;}
  .chafadia-btn:hover{transform:translateY(-3px);background:${theme.gradients.gold};color:${theme.colors.deepBlue};}

  /* Product cards: wider, shorter, cleaner and more professional */
  .grid,
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)) !important;
    gap: 22px !important;
    align-items: stretch !important;
  }

  .ce-product-card {
    max-width: 380px !important;
    border-radius: 24px !important;
  }

  .ce-product-card::before {
    border-radius: 23px !important;
  }

  .ce-media-wrap {
    padding: 9px 9px 0 !important;
  }

  .ce-product-media {
    height: 185px !important;
    border-radius: 20px !important;
  }

  .ce-product-body {
    padding: 11px 13px 14px !important;
  }

  .ce-category-row {
    margin-bottom: 7px !important;
  }

  .ce-category {
    padding: 6px 9px !important;
    font-size: 9.5px !important;
  }

  .ce-product-name {
    min-height: auto !important;
    font-size: 16px !important;
    line-height: 1.16 !important;
    margin-bottom: 6px !important;
  }

  .ce-description {
    min-height: auto !important;
    font-size: 11.5px !important;
    line-height: 1.42 !important;
    -webkit-line-clamp: 2 !important;
    margin-bottom: 9px !important;
  }

  .ce-price-row {
    padding: 10px !important;
    border-radius: 16px !important;
    margin-bottom: 8px !important;
  }

  .ce-price {
    font-size: 18px !important;
  }

  .ce-stock-panel {
    display: none !important;
  }

  .ce-options-row {
    margin-bottom: 8px !important;
  }

  .ce-service-row {
    display: none !important;
  }

  .ce-btn {
    min-height: 38px !important;
    font-size: 11px !important;
  }

  .ce-floating-actions {
    bottom: 10px !important;
  }

  .ce-float-btn {
    min-height: 32px !important;
    font-size: 10px !important;
  }

  @media (max-width: 720px) {
    .ce-product-card {
      max-width: 100% !important;
    }

    .ce-product-media {
      height: 178px !important;
    }
  }
`;

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => safeParse(STORAGE_KEYS.products, defaultProducts));
  const [cart, setCart] = useState(() => safeParse(STORAGE_KEYS.cart, []));
  const [orders, setOrders] = useState(() => safeParse(STORAGE_KEYS.orders, []));
  const [notifications, setNotifications] = useState(() => safeParse(STORAGE_KEYS.notifications, []));
  const [wishlist, setWishlist] = useState(() => safeParse(STORAGE_KEYS.wishlist, []));
  const [compare, setCompare] = useState(() => safeParse(STORAGE_KEYS.compare, []));
  const [reviews, setReviews] = useState(() => safeParse(STORAGE_KEYS.reviews, []));
  const [recentlyViewed, setRecentlyViewed] = useState(() => safeParse(STORAGE_KEYS.recentlyViewed, []));

  useEffect(() => localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compare)), [compare]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(recentlyViewed)), [recentlyViewed]);

  const saveProducts = (newProducts) => setProducts(newProducts);
  const saveCart = (newCart) => setCart(newCart);
  const saveOrders = (newOrders) => setOrders(newOrders);
  const addNotification = (notification) => {
    const item = { id: generateId(), title: notification?.title || "New Notification", message: notification?.message || "", type: notification?.type || "info", read: false, date: new Date().toISOString().slice(0, 10), time: new Date().toLocaleTimeString(), createdAt: new Date().toISOString() };
    setNotifications((prev) => [item, ...prev]);
    return item;
  };
  const markNotificationRead = (id) => setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, read: true } : item));
  const clearNotifications = () => setNotifications([]);

  const normalizeProduct = (product) => createProduct({ ...product, id: product.id || generateId(), stock: product.stock || 0, image: product.image || "", description: product.description || "" });
  const addProduct = (product) => { const newProduct = normalizeProduct(product); setProducts((prev) => [newProduct, ...prev]); addNotification({ title: "Product Added", message: `${newProduct.name} was added.`, type: "product" }); return newProduct; };
  const updateProduct = (id, updatedData) => setProducts((prev) => prev.map((product) => product.id === id ? normalizeProduct({ ...product, ...updatedData, id: product.id }) : product));
  const deleteProduct = (id) => setProducts((prev) => prev.filter((item) => item.id !== id));
  const setProductAvailability = (id, status) => updateProduct(id, { status });
  const resetProductsToDefault = () => { setProducts(defaultProducts); localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(defaultProducts)); };

  const addToCart = (product, qty = 1) => {
    if (!product) return cart;
    const quantityToAdd = Math.max(1, cleanNumber(qty) || 1);
    const selectedVariant = product.selectedVariant || "Standard";
    const existing = cart.find((item) => item.id === product.id && (item.selectedVariant || "Standard") === selectedVariant);
    const updatedCart = existing
      ? cart.map((item) => item.id === product.id && (item.selectedVariant || "Standard") === selectedVariant ? { ...item, qty: cleanNumber(item.qty || 1) + quantityToAdd } : item)
      : [...cart, { ...product, cartId: generateId(), qty: quantityToAdd, selectedVariant, addedAt: new Date().toISOString() }];
    setCart(updatedCart);
    return updatedCart;
  };
  const removeFromCart = (idOrIndex) => {
    let updatedCart = cart.filter((item) => item.id !== idOrIndex && item.cartId !== idOrIndex);
    if (updatedCart.length === cart.length && Number.isInteger(idOrIndex)) updatedCart = cart.filter((_, index) => index !== idOrIndex);
    setCart(updatedCart);
  };
  const clearCart = () => setCart([]);
  const updateCartQuantity = (idOrIndex, qty) => setCart((prev) => prev.map((item, index) => item.id === idOrIndex || item.cartId === idOrIndex || index === idOrIndex ? { ...item, qty: Math.max(1, cleanNumber(qty) || 1) } : item));
  const increaseCartQuantity = (idOrIndex) => setCart((prev) => prev.map((item, index) => item.id === idOrIndex || item.cartId === idOrIndex || index === idOrIndex ? { ...item, qty: cleanNumber(item.qty || 1) + 1 } : item));
  const decreaseCartQuantity = (idOrIndex) => setCart((prev) => prev.map((item, index) => item.id === idOrIndex || item.cartId === idOrIndex || index === idOrIndex ? { ...item, qty: Math.max(1, cleanNumber(item.qty || 1) - 1) } : item));
  const calculateItemsTotal = (items = []) => items.reduce((sum, item) => sum + cleanNumber(item.qty || item.quantity || 1) * cleanNumber(item.price), 0);
  const calculateCartTotal = () => calculateItemsTotal(cart);
  const getCartCount = () => cart.reduce((sum, item) => sum + cleanNumber(item.qty || 1), 0);

  const getDeliveryFee = (deliveryType) => {
    if (deliveryType === "Home Delivery") return 1000;
    if (deliveryType === "Express Delivery") return 2000;
    if (deliveryType === "Nationwide Delivery") return 3500;
    if (deliveryType === "Worldwide Delivery") return 10000;
    return 0;
  };
  const reduceProductStock = (items = []) => setProducts((prev) => prev.map((product) => {
    const soldItem = items.find((item) => item.id === product.id || item.name?.toLowerCase().trim() === product.name?.toLowerCase().trim());
    if (!soldItem) return product;
    const newStock = Math.max(0, cleanNumber(product.stock) - cleanNumber(soldItem.qty || 1));
    return { ...product, stock: newStock, status: newStock <= 0 ? "Out of Stock" : "Available", updatedAt: new Date().toISOString() };
  }));
  const restoreProductStock = (items = []) => setProducts((prev) => prev.map((product) => {
    const returnedItem = items.find((item) => item.id === product.id || item.name?.toLowerCase().trim() === product.name?.toLowerCase().trim());
    if (!returnedItem) return product;
    const newStock = cleanNumber(product.stock) + cleanNumber(returnedItem.qty || 1);
    return { ...product, stock: newStock, status: newStock > 0 ? "Available" : product.status, updatedAt: new Date().toISOString() };
  }));

  const createPaymentRecord = (payment = {}) => ({ id: generateId(), method: payment.method || payment.paymentMethod || "Cash", amount: cleanNumber(payment.amount), reference: payment.reference || payment.transactionReference || "", senderName: payment.senderName || "", phone: payment.phone || "", note: payment.note || "", proof: payment.proof || "", idCard: payment.idCard || "", status: payment.status || "Pending", date: payment.date || new Date().toISOString().slice(0, 10), time: payment.time || new Date().toLocaleTimeString(), createdAt: new Date().toISOString() });
  const normalizeOrder = (orderData = {}) => {
    const items = (orderData.items || cart || []).map((item) => ({ ...item, id: item.id, name: item.name || "Product", qty: cleanNumber(item.qty || item.quantity || 1), price: cleanNumber(item.price), category: item.category || "", image: item.image || "", selectedVariant: item.selectedVariant || "Standard" }));
    const itemsTotal = calculateItemsTotal(items);
    const deliveryFee = cleanNumber(orderData.deliveryFee) || getDeliveryFee(orderData.deliveryType);
    const discount = cleanNumber(orderData.discount);
    const total = cleanNumber(orderData.total) || Math.max(0, itemsTotal + deliveryFee - discount);
    const amountPaid = cleanNumber(orderData.amountPaid || orderData.paidAmount);
    const paymentStatus = orderData.paymentStatus || (amountPaid >= total && total > 0 ? "Paid" : "Pending");
    return { id: orderData.id || generateId(), receiptNo: orderData.receiptNo || formatReceiptNo(), customer: orderData.customer || { name: orderData.customerName || "Customer", phone: orderData.customerPhone || "", email: orderData.customerEmail || "" }, customerName: orderData.customerName || orderData.customer?.name || "Customer", customerPhone: orderData.customerPhone || orderData.customer?.phone || "", customerEmail: orderData.customerEmail || orderData.customer?.email || "", items, itemsTotal, discount, deliveryFee, deliveryType: orderData.deliveryType || "Pickup", deliveryAddress: orderData.deliveryAddress || "", total, amountPaid, paidAmount: amountPaid, balance: Math.max(0, total - amountPaid), paymentMethod: orderData.paymentMethod || "Cash", paymentStatus, paymentHistory: orderData.paymentHistory || [], status: orderData.status || (paymentStatus === "Paid" ? "Processing" : "Pending"), orderStatus: orderData.orderStatus || orderData.status || (paymentStatus === "Paid" ? "Processing" : "Pending"), date: orderData.date || new Date().toISOString().slice(0, 10), source: orderData.source || "Checkout", note: orderData.note || "", createdAt: orderData.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  };
  const placeOrder = (orderData = {}) => { const newOrder = normalizeOrder(orderData); setOrders((prev) => [newOrder, ...prev]); reduceProductStock(newOrder.items); if (orderData.clearCartAfterOrder) clearCart(); addNotification({ title: "New Order", message: `Order ${newOrder.receiptNo} was created.`, type: "order" }); return newOrder; };
  const placeOrderFromCart = (customer = {}, options = {}) => placeOrder({ customer, customerName: customer.name || "Customer", customerPhone: customer.phone || "", customerEmail: customer.email || "", items: cart, deliveryType: options.deliveryType || "Pickup", deliveryFee: options.deliveryFee || 0, discount: options.discount || 0, total: options.total || 0, paymentMethod: options.paymentMethod || "Pending", paymentStatus: options.paymentStatus || "Pending", status: "Pending", orderStatus: "Pending", source: "Cart", note: options.note || "", clearCartAfterOrder: true });
  const addPaymentToOrder = (orderId, paymentData = {}) => { let updatedOrder = null; setOrders((prev) => prev.map((order) => { if (order.id !== orderId) return order; const payment = createPaymentRecord(paymentData); const newPaid = cleanNumber(order.amountPaid || order.paidAmount) + cleanNumber(payment.amount); const balance = Math.max(0, cleanNumber(order.total) - newPaid); const paymentStatus = balance <= 0 ? "Paid" : "Pending"; updatedOrder = { ...order, amountPaid: newPaid, paidAmount: newPaid, balance, paymentMethod: payment.method, paymentStatus, status: paymentStatus === "Paid" ? "Processing" : order.status, orderStatus: paymentStatus === "Paid" ? "Processing" : order.orderStatus, paymentHistory: [payment, ...(order.paymentHistory || [])], updatedAt: new Date().toISOString() }; return updatedOrder; })); return updatedOrder; };
  const addRecordedSale = (saleData = {}) => { const items = (saleData.items || []).map((item) => ({ id: item.id, name: item.name, qty: cleanNumber(item.qty || 1), price: cleanNumber(item.price), category: item.category || "", image: item.image || "" })); const total = cleanNumber(saleData.total) || calculateItemsTotal(items); const amountPaid = cleanNumber(saleData.amountPaid || saleData.paidAmount || total); return placeOrder({ customer: { name: saleData.customerName || "Walk-in Customer", phone: saleData.customerPhone || "", email: saleData.customerEmail || "" }, customerName: saleData.customerName || "Walk-in Customer", customerPhone: saleData.customerPhone || "", customerEmail: saleData.customerEmail || "", items, total, amountPaid, paidAmount: amountPaid, paymentMethod: saleData.paymentMethod || "Cash", paymentStatus: amountPaid >= total ? "Paid" : "Pending", paymentHistory: amountPaid > 0 ? [createPaymentRecord({ method: saleData.paymentMethod || "Cash", amount: amountPaid, reference: saleData.reference || "", status: amountPaid >= total ? "Completed" : "Part Payment" })] : [], status: amountPaid >= total ? "Processing" : "Pending", orderStatus: amountPaid >= total ? "Processing" : "Pending", date: saleData.date || new Date().toISOString().slice(0, 10), source: "SalesReports", note: saleData.note || "" }); };
  const markAsPaid = (id, paymentData = {}) => setOrders((prev) => prev.map((order) => order.id === id ? { ...order, amountPaid: cleanNumber(order.total), paidAmount: cleanNumber(order.total), balance: 0, paymentStatus: "Paid", status: order.status === "Delivered" ? "Delivered" : "Processing", orderStatus: order.orderStatus === "Delivered" ? "Delivered" : "Processing", paymentHistory: [createPaymentRecord({ method: paymentData.method || order.paymentMethod || "Cash", amount: paymentData.amount || order.total, reference: paymentData.reference || "", status: "Completed" }), ...(order.paymentHistory || [])], updatedAt: new Date().toISOString() } : order));
  const updateOrderStatus = (id, status) => setOrders((prev) => prev.map((order) => order.id === id ? { ...order, status, orderStatus: status, updatedAt: new Date().toISOString() } : order));
  const updateOrder = (id, updatedData) => setOrders((prev) => prev.map((order) => order.id === id ? normalizeOrder({ ...order, ...updatedData, id: order.id, createdAt: order.createdAt, receiptNo: order.receiptNo }) : order));
  const deleteOrder = (id, shouldRestoreStock = false) => { const order = orders.find((item) => item.id === id); if (shouldRestoreStock && order) restoreProductStock(order.items); setOrders((prev) => prev.filter((item) => item.id !== id)); };
  const cancelOrder = (id, shouldRestoreStock = true) => { const order = orders.find((item) => item.id === id); if (shouldRestoreStock && order) restoreProductStock(order.items); setOrders((prev) => prev.map((item) => item.id === id ? { ...item, status: "Cancelled", orderStatus: "Cancelled", updatedAt: new Date().toISOString() } : item)); };
  const getOrdersByCustomerEmail = (email) => email ? orders.filter((order) => order.customer?.email === email || order.customerEmail === email) : [];
  const getLowStockProducts = (limit = 5) => products.filter((product) => cleanNumber(product.stock) <= limit);
  const getDailySales = (date = new Date().toISOString().slice(0, 10)) => { const dayOrders = orders.filter((order) => order.date === date); return { date, orders: dayOrders, totalSales: dayOrders.reduce((sum, order) => sum + cleanNumber(order.total), 0), totalPaid: dayOrders.reduce((sum, order) => sum + cleanNumber(order.amountPaid || order.paidAmount), 0), totalBalance: dayOrders.reduce((sum, order) => sum + Math.max(0, cleanNumber(order.total) - cleanNumber(order.amountPaid || order.paidAmount)), 0) }; };

  const toggleWishlist = (product) => { if (!product) return false; const exists = wishlist.some((item) => item.id === product.id); if (exists) { setWishlist((prev) => prev.filter((item) => item.id !== product.id)); return false; } setWishlist((prev) => [product, ...prev]); return true; };
  const isWishlisted = (id) => wishlist.some((item) => item.id === id);
  const toggleCompare = (product) => { if (!product) return false; const exists = compare.some((item) => item.id === product.id); if (exists) { setCompare((prev) => prev.filter((item) => item.id !== product.id)); return false; } if (compare.length >= 4) { alert("You can compare up to 4 products."); return false; } setCompare((prev) => [product, ...prev]); return true; };
  const clearCompare = () => setCompare([]);
  const addRecentlyViewed = (product) => { if (!product) return; setRecentlyViewed((prev) => [product, ...prev.filter((item) => item.id !== product.id)].slice(0, 12)); };
  const addReview = (productId, review) => { const item = { id: generateId(), productId, name: review.name || "Customer", rating: cleanNumber(review.rating || 5), comment: review.comment || "", date: new Date().toISOString().slice(0, 10), verified: Boolean(review.verified) }; setReviews((prev) => [item, ...prev]); return item; };
  const getProductReviews = (productId) => reviews.filter((review) => review.productId === productId);
  const getProductRating = (productId) => { const productReviews = getProductReviews(productId); if (!productReviews.length) return 5; const total = productReviews.reduce((sum, review) => sum + cleanNumber(review.rating), 0); return Number((total / productReviews.length).toFixed(1)); };

  const receipts = useMemo(() => orders.filter((order) => order.paymentStatus === "Paid").map((order) => ({ ...order, customerName: order.customerName || order.customer?.name, customerPhone: order.customerPhone || order.customer?.phone, customerEmail: order.customerEmail || order.customer?.email, amountPaid: order.amountPaid || order.paidAmount || order.total, paidAmount: order.amountPaid || order.paidAmount || order.total, balance: order.balance || 0 })), [orders]);
  const allReceipts = useMemo(() => orders.map((order) => ({ ...order, customerName: order.customerName || order.customer?.name, customerPhone: order.customerPhone || order.customer?.phone, customerEmail: order.customerEmail || order.customer?.email, amountPaid: order.amountPaid || order.paidAmount || 0, paidAmount: order.amountPaid || order.paidAmount || 0, balance: order.balance ?? Math.max(0, cleanNumber(order.total) - cleanNumber(order.amountPaid || order.paidAmount)) })), [orders]);
  const transactions = useMemo(() => orders.flatMap((order) => (order.paymentHistory || []).map((payment) => ({ ...payment, orderId: order.id, receiptNo: order.receiptNo, customerName: order.customerName || order.customer?.name, customerEmail: order.customerEmail || order.customer?.email, total: order.total, paymentStatus: order.paymentStatus }))), [orders]);
  const analytics = useMemo(() => ({ totalProducts: products.length, totalOrders: orders.length, paidOrders: orders.filter((order) => order.paymentStatus === "Paid").length, pendingOrders: orders.filter((order) => order.paymentStatus !== "Paid").length, totalRevenue: orders.reduce((sum, order) => sum + cleanNumber(order.amountPaid || order.paidAmount), 0), expectedRevenue: orders.reduce((sum, order) => sum + cleanNumber(order.total), 0), outstandingBalance: orders.reduce((sum, order) => sum + Math.max(0, cleanNumber(order.total) - cleanNumber(order.amountPaid || order.paidAmount)), 0), lowStockProducts: getLowStockProducts(), cartCount: getCartCount(), wishlistCount: wishlist.length, compareCount: compare.length }), [products, orders, cart, wishlist, compare]);
  const productCategories = useMemo(() => ["All", ...new Set(products.map((product) => product.category))], [products]);
  const productCollections = useMemo(() => [...new Set(products.map((product) => product.collection).filter(Boolean))], [products]);
  const searchProducts = (query) => { const cleanQuery = String(query || "").toLowerCase().trim(); if (!cleanQuery) return products; return products.filter((product) => `${product.name} ${product.category} ${product.collection} ${product.description}`.toLowerCase().includes(cleanQuery)); };
  const getFeaturedProducts = (limit = 12) => products.filter((product) => product.featured).slice(0, limit);
  const getProductsByCategory = (category) => category === "All" ? products : products.filter((product) => product.category === category);
  const getRelatedProducts = (product, limit = 8) => product ? products.filter((item) => item.id !== product.id && (item.category === product.category || item.collection === product.collection)).slice(0, limit) : [];

  const value = {
    products, cart, orders, receipts, allReceipts, transactions, notifications, wishlist, compare, reviews, recentlyViewed, analytics,
    theme, styles, injectGlobalStyles, luxuryCollections, productCategories, productCollections,
    saveProducts, saveCart, saveOrders,
    addProduct, updateProduct, deleteProduct, setProductAvailability, resetProductsToDefault, getLowStockProducts,
    addToCart, removeFromCart, updateCartQuantity, increaseCartQuantity, decreaseCartQuantity, clearCart, calculateCartTotal, calculateItemsTotal, getCartCount,
    placeOrder, placeOrderFromCart, addPaymentToOrder, addRecordedSale, markAsPaid, updateOrderStatus, updateOrder, deleteOrder, cancelOrder, getOrdersByCustomerEmail,
    getDeliveryFee, getDailySales,
    addNotification, markNotificationRead, clearNotifications,
    toggleWishlist, isWishlisted, toggleCompare, clearCompare, addRecentlyViewed,
    addReview, getProductReviews, getProductRating,
    searchProducts, getFeaturedProducts, getProductsByCategory, getRelatedProducts,
    formatMoney,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// The hook intentionally shares this context module's public API; keep the
// fast-refresh rule scoped to this non-component export.
// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
};
