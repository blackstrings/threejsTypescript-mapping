export class AttributeType {

  protected static values: Map<String, AttributeType> = new Map<String, AttributeType>();

  public static readonly GENERIC_CLEAR = new AttributeType('clear');
  public static readonly SPACE_OPEN = new AttributeType('space open');
  public static readonly SPACE_CLOSE = new AttributeType('space close');

  /**
   * Creates an instance of ThreeDAttributeType.
   *
   * Any time a new instance is created, the instance is pushed into the "values" map for later lookup
   *
   * The label by default is set to "Not Assigned". Should the ThreeDAttributeType require a unique label for front end, set it during construction.
   *
   * Ex: Deck Online uses the attribute for naming color keys, but doesn't want to use the value name as is.
   * Naming the "value" to match what's in the database should have higher priority than using it for labeling in the front end, hence, we introduced label.
   *
   * @param {string} value the unique key for later lookup in the values map
   * @param {string} [label='Not Assigned'] allows the app access to an alternative name more suitable for front end use
   * @memberof ThreeDAttributeType
   *
   */
  protected constructor(protected value: string, protected label: string = 'Not Assigned') {
    AttributeType.values.set(value, this);
  }

  public static lookUp(value: string): AttributeType {
    return AttributeType.values.has(value) ? AttributeType.values.get(value) : null;
  }

  public toString(): string {
    return this.value;
  }

  /**
   * Returns the label.
   *
   * @returns {string}
   * @memberof ThreeDAttributeType
   */
  public getLabel(): string {
    return this.label;
  }

}
