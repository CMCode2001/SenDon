import api from './api';

export const registerUser = async (formData: any) => {
  const payload = {
    firstName: formData.prenom,
    lastName: formData.nom,
    email: formData.email,
    password: formData.password,
    phoneNumber: formData.telephone,
    birthDate: formData.dateNaissance,
    bloodType: formData.groupeSanguin,
    role: "USER", // ou dynamique
    address: formData.adresse,
    city: "", // à compléter si nécessaire
    postalCode: "", // idem
    hospitalName: "", // pour un donneur : vide
    licenseNumber: "", // idem
  };

  const response = await api.post('/auth/register', payload);
  return response.data;
};
