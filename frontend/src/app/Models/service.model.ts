export class ServiceModel {
  _id?: string;
  type: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  commission: number;
  image?: string;

  // constructor(
  //     type: string,
  //     name: string,
  //     price: number,
  //     duration: number,
  //     commission: number,
  //     image: string
  // ) {
  //     this.type = type;
  //     this.name = name;
  //     this.price = price;
  //     this.duration = duration;
  //     this.commission = commission;
  //     this.image = image;
  // }
}

export class ServiceModelWithSelected extends ServiceModel {
  selected: boolean = false;
}
