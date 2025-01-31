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
      console.log(`Warning: Key not found: ${keys[0]}`);
    }

    if (keys.length === 1) return cartSection[keys[0]];
    return this.getFieldFromCart(cartSection[keys[0]], keys.slice(1));
  }

  /**
   * Recursively checks if the field meets the provided condition.
   *
   * @param {any} cartFieldValue - The value of the field from the cart.
   * @param {Object} condition - The condition to check against the field value.
   * @return {boolean} - Returns true if the condition is satisfied,otherwise return false.
   *
   */

  evaluateCondition(cartFieldValue, condition) {
    if (typeof condition !== "object") {
      return cartFieldValue == condition;
    }

    const [conditionKey] = Object.keys(condition);

    switch (conditionKey) {
      case "gt":
        return cartFieldValue > condition[conditionKey];
      case "lt":
        return cartFieldValue < condition[conditionKey];
      case "gte":
        return cartFieldValue >= condition[conditionKey];
      case "lte":
        return cartFieldValue <= condition[conditionKey];
      case "and":
        return Object.entries(condition[conditionKey]).every(([key, value]) =>
          this.evaluateCondition(cartFieldValue, { [key]: value })
        );
      case "or":
        return Object.entries(condition[conditionKey]).some(([key, value]) =>
          this.evaluateCondition(cartFieldValue, { [key]: value })
        );
      case "in":
        if (!Array.isArray(cartFieldValue)) {
          return condition[conditionKey].includes(cartFieldValue);
        }

        return cartFieldValue.some((item) =>
          condition[conditionKey].includes(item)
        );

      default:
        console.log(`Warning: Unknown condition: ${conditionKey}`);
        return false;
    }
  }

  /**
   * Verifies if a specific condition is fulfilled for a given cart and key.
   *
   * @param {Object} cartData - The data of the cart to evaluate.
   * @param {string} fieldPath - The path to the field in the cart.
   * @param {Object} condition - The condition to validate against the field.
   * @return {boolean} - Returns true if the condition is satisfied, otherwise return false.
   */
  evaluateConditionForCart(cartData, fieldPath, condition) {
    const fieldValue = this.getFieldFromCart(cartData, fieldPath.split("."));
    return this.evaluateCondition(fieldValue, condition);
  }

  /**
   * Determines if the cart meets all eligibility criteria.
   * Returns false if any condition is not met.
   *
   * @param {Object} cartData - The cart data to assess.
   * @param {Object} conditions - The conditions the cart must satisfy.
   * @return {boolean} - Returns true if the cart meets the criteria, otherwise return false.
   */

  isEligible(cartData, conditions) {
    return Object.entries(conditions).every(([field, condition]) =>
      this.evaluateConditionForCart(cartData, field, condition)
    );
  }
}

module.exports = {
  EligibilityService,
};
