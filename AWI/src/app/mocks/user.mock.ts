import { User } from 'src/app/model/user.model';

export const MockUser: User = {
  id: 1,
  prenom: 'John',
  nom: 'Doe',
  pseudo: 'john_doe123',
  associations: ['Association A', 'Association B'],
  mail: 'johndoe@example.com',
  password: 'password123',
  tailleTShirt: 'M',
  isVegetarian: true,
  role: '',
};