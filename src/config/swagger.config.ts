import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "🌋 Volcano API",
    version: "1.0.0",
    description:
      "Complete REST API documentation for the Volcano warehouse & employee management system.",
    contact: {
      name: "Fakhr Basha",
      email: "fakhrbasha8@gmail.com",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current Server",
    },
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token (without 'Bearer ' prefix)",
      },
    },
    schemas: {
      // ─── Auth ────────────────────────────────────────────────
      RegisterBody: {
        type: "object",
        required: ["userName", "email", "password", "confirmPassword", "role"],
        properties: {
          userName: { type: "string", minLength: 3, maxLength: 25, example: "john_doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", minLength: 6, example: "secret123" },
          confirmPassword: { type: "string", minLength: 6, example: "secret123" },
          phone: { type: "string", example: "01012345678" },
          role: { type: "string", enum: ["admin", "user", "employee"], example: "admin" },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "secret123" },
        },
      },
      ConfirmEmailBody: {
        type: "object",
        required: ["email", "otp"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          otp: { type: "string", example: "123456" },
        },
      },
      EmailOnlyBody: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
        },
      },
      ResetPasswordBody: {
        type: "object",
        required: ["email", "otp", "newPassword"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          otp: { type: "string", example: "123456" },
          newPassword: { type: "string", example: "newSecret123" },
        },
      },
      UpdatePasswordBody: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldPassword: { type: "string", example: "oldSecret123" },
          newPassword: { type: "string", example: "newSecret456" },
        },
      },
      // ─── Department ──────────────────────────────────────────
      DepartmentBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Spinning" },
        },
      },
      // ─── Employee ────────────────────────────────────────────
      CreateEmployeeBody: {
        type: "object",
        required: ["fullName", "salary", "phone", "role"],
        properties: {
          fullName: { type: "string", example: "Ahmed Hassan" },
          salary: { type: "number", example: 5000 },
          phone: { type: "string", example: "01098765432" },
          role: { type: "string", example: "supervisor" },
        },
      },
      UpdateEmployeeBody: {
        type: "object",
        properties: {
          fullName: { type: "string", example: "Ahmed Hassan" },
          salary: { type: "number", example: 6000 },
          phone: { type: "string", example: "01098765432" },
          role: { type: "string", example: "manager" },
        },
      },
      // ─── Material ────────────────────────────────────────────
      AddMaterialBody: {
        type: "object",
        required: ["name", "unit"],
        properties: {
          name: { type: "string", example: "Cotton Yarn" },
          description: { type: "string", example: "High quality cotton" },
          code: { type: "string", example: "CTN-001" },
          unit: { type: "string", enum: ["kg", "g", "meter", "piece"], example: "kg" },
        },
      },
      UpdateMaterialBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Polyester Yarn" },
          description: { type: "string", example: "Updated description" },
          code: { type: "string", example: "PLY-002" },
          unit: { type: "string", example: "meter" },
        },
      },
      // ─── Color ───────────────────────────────────────────────
      AddColorBody: {
        type: "object",
        required: ["name", "hexCode"],
        properties: {
          name: { type: "string", example: "Red" },
          hexCode: { type: "string", example: "#FF0000" },
        },
      },
      UpdateColorBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Dark Red" },
          hexCode: { type: "string", example: "#8B0000" },
        },
      },
      // ─── Yarn Stock ──────────────────────────────────────────
      AddYarnStockBody: {
        type: "object",
        required: ["materialId", "colorId", "quantity", "minQuantity"],
        properties: {
          materialId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
          colorId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7c" },
          quantity: { type: "number", minimum: 0, example: 500 },
          minQuantity: { type: "number", minimum: 0, example: 50 },
        },
      },
      // ─── Stock Transaction ───────────────────────────────────
      StockInOutBody: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "number", minimum: 0, example: 100 },
          reason: { type: "string", example: "Monthly replenishment" },
        },
      },
      // ─── Purchase Order ──────────────────────────────────────
      PurchaseOrderItem: {
        type: "object",
        required: ["materialId", "colorId", "quantity", "unitPrice"],
        properties: {
          materialId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
          colorId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7c" },
          quantity: { type: "number", minimum: 1, example: 200 },
          unitPrice: { type: "number", minimum: 0.01, example: 35.5 },
        },
      },
      CreatePurchaseOrderBody: {
        type: "object",
        required: ["supplierId", "items"],
        properties: {
          supplierId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7d" },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/PurchaseOrderItem" },
          },
          notes: { type: "string", example: "Urgent delivery needed by end of week" },
        },
      },
      // ─── Supplier ────────────────────────────────────────────
      CreateSupplierBody: {
        type: "object",
        required: ["companyName", "contactPerson", "phone"],
        properties: {
          companyName: { type: "string", example: "Nile Textiles Co." },
          contactPerson: { type: "string", example: "Mohamed Ali" },
          email: { type: "string", format: "email", example: "contact@niletextiles.com" },
          phone: { type: "string", example: "01234567890" },
          address: { type: "string", example: "Cairo, Egypt" },
          note: { type: "string", example: "Preferred supplier" },
        },
      },
      UpdateSupplierBody: {
        type: "object",
        properties: {
          companyName: { type: "string", example: "Nile Textiles Co." },
          contactPerson: { type: "string", example: "Mohamed Ali" },
          email: { type: "string", format: "email", example: "new@niletextiles.com" },
          phone: { type: "string", example: "01234567890" },
          address: { type: "string", example: "Alexandria, Egypt" },
          note: { type: "string", example: "Updated note" },
        },
      },
      // ─── Customer ────────────────────────────────────────────
      CreateCustomerBody: {
        type: "object",
        required: ["name", "phone", "address"],
        properties: {
          name: { type: "string", minLength: 3, example: "Mohamed Salem" },
          phone: { type: "string", minLength: 10, example: "01012345678" },
          address: { type: "string", minLength: 3, example: "Cairo, Egypt" },
          note: { type: "string", example: "Regular customer" },
        },
      },
      UpdateCustomerBody: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, example: "Mohamed Salem" },
          phone: { type: "string", minLength: 10, example: "01012345678" },
          address: { type: "string", minLength: 3, example: "Alexandria, Egypt" },
          note: { type: "string", example: "Updated note" },
        },
      },
      // ─── Expense ─────────────────────────────────────────────
      CreateExpenseBody: {
        type: "object",
        required: ["title", "amount", "category"],
        properties: {
          title: { type: "string", minLength: 3, example: "Electricity Bill" },
          amount: { type: "number", minimum: 0.01, example: 1200 },
          category: { type: "string", minLength: 2, example: "Utilities" },
          expenseDate: { type: "string", format: "date", example: "2026-06-01" },
          note: { type: "string", example: "Monthly electricity payment" },
        },
      },
      UpdateExpenseBody: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 3, example: "Water Bill" },
          amount: { type: "number", minimum: 0.01, example: 500 },
          category: { type: "string", minLength: 2, example: "Utilities" },
          expenseDate: { type: "string", format: "date", example: "2026-06-05" },
          note: { type: "string", example: "Updated note" },
        },
      },
      // ─── Product ─────────────────────────────────────────────
      CreateProductBody: {
        type: "object",
        required: ["name", "sku", "category", "sellingPrice", "availableSizes", "availableColors", "quantity"],
        properties: {
          name: { type: "string", example: "Classic T-Shirt" },
          sku: { type: "string", example: "TS-001" },
          description: { type: "string", example: "Comfortable everyday cotton t-shirt" },
          category: { type: "string", example: "T-Shirts" },
          sellingPrice: { type: "string", example: "150" },
          availableSizes: {
            type: "array",
            items: { type: "string", enum: ["XS", "S", "M", "L", "XL", "XXL"] },
            example: ["S", "M", "L"],
          },
          availableColors: {
            type: "array",
            items: { type: "string" },
            example: ["664f1c2e3a1b2c3d4e5f6a7c"],
          },
          quantity: { type: "string", example: "100" },
        },
      },
      UpdateProductBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Updated T-Shirt" },
          sku: { type: "string", example: "TS-001-V2" },
          description: { type: "string", example: "Updated description" },
          category: { type: "string", example: "T-Shirts" },
          sellingPrice: { type: "string", example: "175" },
          availableSizes: {
            type: "array",
            items: { type: "string", enum: ["XS", "S", "M", "L", "XL", "XXL"] },
          },
          availableColors: { type: "array", items: { type: "string" } },
          quantity: { type: "string", example: "80" },
          isActive: { type: "boolean", example: true },
        },
      },
      // ─── Generic Responses ───────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operation completed successfully" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Something went wrong" },
          status: { type: "number", example: 400 },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/docs/**/*.yaml", "./src/docs/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
