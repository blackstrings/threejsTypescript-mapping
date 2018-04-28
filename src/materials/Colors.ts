/**
 * Containes color codes in HEX format.
 *
 * @export
 * @class Colors
 */
export class Colors {
  
    protected static values: Map<number, Colors> = new Map<number, Colors>();
  
    /**
     * Ain't nuthin' any blacker...
     *
     * @static
     * @memberof Colors
     */
    public static readonly ABSOLUTE_BLACK = new Colors(0x000000);
  
    /**
     * Used by Dimensions
     *
     * @static
     * @memberof Colors
     */
    public static readonly BLACK = new Colors(0x021919);
  
    /**
     * MESH_BASIC_DEFAULT
     *
     * @static
     * @memberof Colors
     */
    public static readonly BLUE = new Colors(0x2D8BF6);
  
    /**
     * Used by UnattachedWall highlighted
     *
     * @static
     * @memberof Colors
     */
    public static readonly DARK_BLUE = new Colors(0x0B477A);
  
    /**
     * Used by Corner (future)
     *
     * @static
     * @memberof Colors
     */
    public static readonly LIGHT_BLUE = new Colors(0x8EC0F8);
  
    /**
     * Used by Framing2D Dark
     *
     * @static
     * @memberof Colors
     */
    public static readonly BROWN = new Colors(0xAE4902);
  
    /**
     * Used by Framing2D, Railing2D
     *
     * @static
     * @memberof Colors
     */
    public static readonly LIGHT_BROWN = new Colors(0xCD853F);
  
    /**
     * Used by HeightPost in LevelHeight Screen
     *
     * @static
     * @memberof Colors
     */
    public static readonly DARK_BROWN = new Colors(0x7D591D);
  
    public static readonly DEEP_BROWN = new Colors(0x422605);
  
    /**
     * Used by Level2D
     *
     * @static
     * @memberof Colors
     */
    public static readonly TAN = new Colors(0xD0AE57);
  
    /**
     * Used by DeckSide2D unhighlighted
     *
     * @static
     * @memberof Colors
     */
    public static readonly GREY = new Colors(0x999999);
  
    /**
     * Used by DeckSide2D highlighted
     *
     * @static
     * @memberof Colors
     */
    public static readonly DARK_GREY = new Colors(0x505557);
  
    /**
     * Used by Grid
     *
     * @static
     * @memberof Colors
     */
    public static readonly LIGHT_GREY = new Colors(0xEDEDED);
  
    /**
     * Used by LevelHeight Grass
     *
     * @static
     * @memberof Colors
     */
    public static readonly GREEN = new Colors(0x70F62F);
  
    public static readonly MENARDS_GREEN = new Colors(0x009a3d);
  
    /**
     * Used by AttachedWall unhighlighted
     *
     * @static
     * @memberof Colors
     */
    public static readonly MENARDS_YELLOW = new Colors(0xf7cd09);
  
    public static readonly DARK_YELLOW = new Colors(0xAA9120);
  
    /**
     * Used as default color for Materials that could not be loaded. Typically, if an object is displayed in RED, there was a problem loading Material.
     *
     * @static
     * @memberof Colors
     */
    public static readonly RED = new Colors(0xFF0000);
  
    /**
     * Used by Drag Proxy
     *
     * @static
     * @memberof Colors
     */
    public static readonly LIGHT_RED = new Colors(0xFF3333);
  
    /**
     * Used in multiple places: FramingMaterial3D, Decking3D, Cladding3D, Railing3D
     *
     * @static
     * @memberof Colors
     */
    public static readonly WHITE = new Colors(0xF5F4F2);
  
    protected constructor(protected _value: number) {
      Colors.values.set(_value, this);
    }
  
    public value(): number {
      return this._value;
    }
  
    public static fromValue(value: number): Colors {
      return Colors.values.has(value) ? Colors.values.get(value) : null;
    }
  
  }
  