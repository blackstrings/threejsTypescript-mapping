
export class Vendor {

  private spaceUUID: string = '';

  private firstName: string;
  private lastName: string;
  private businessName: string;
  private id: number;

  constructor(id: number, businessName: string) {
    this.id = id;
    this.businessName = businessName;
  }

  public setSpaceUUID(uuid: string): void {
    this.spaceUUID = uuid;
  }

  public getSpaceUUID(): string {
    return this.spaceUUID;
  }

  public setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  public setLastName(lastName: string): void {
    this.lastName = lastName;
  }
  
  public getId(): number {
    return this.id;
  }
}