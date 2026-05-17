export const cityUppercase = (inp) => {
  if (!inp) return ""; 

  return inp
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
    
};
