// const request = require("supertest");
// const app = require("../app"); // ✅ import app, not server

// describe("User Signup API", () => {
//   it("should create a new user", async () => {
//     const res = await request(app)
//       .post("/signup")
//       .send({
//         firstName: "Test User",
//         lastName:"ahmad",
//         emailId: "test@example.com",
//         password: "123456@Axs",
//       });

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("message", "User created successfully");
//   });
// });
