class EligibilityService {
  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */

  /**
   * @param {Object} cartSection - The section of the cart being examined.
   * @param {Array} keys - The path representing the keys to the target field.
   * @return {any} - The value of the field, or throws an error if not found.
   */
  getFieldFromCart(cartSection, keys) {
    if (!cartSection || !cartSection.hasOwnProperty(keys[0])) {
      if (Array.isArray(cartSection)) {
        return cartSection.map((item) => item[keys[0]]);
      }
      throw new Error(`Key not found: ${keys[0]}`);
    }
    if (keys.length === 1) return cartSection[keys[0]];
    return this.getFieldFromCart(cartSection[keys[0]], keys.slice(1));
  }
  isEligible(cart, criteria) {
    // TODO: compute cart eligibility here.
    return false;
  }
}

module.exports = {
  EligibilityService,
};
