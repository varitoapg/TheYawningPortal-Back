import CustomError from "./CustomError";

describe("Given the CustomError class", () => {
  describe("When it is instantiated with the message 'Custom Error', statusCode 500 and public message 'Fatal error'", () => {
    test("Then it should return an object with those properties and values", () => {
      const expectedError = {
        message: "Custom Error",
        statusCode: 500,
        publicMessage: "Fatal error",
      };

      const customError = new CustomError(
        expectedError.message,
        expectedError.publicMessage,
        expectedError.statusCode
      );

      expect(customError).toHaveProperty("message", expectedError.message);
      expect(customError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );
      expect(customError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
    });
  });
});
