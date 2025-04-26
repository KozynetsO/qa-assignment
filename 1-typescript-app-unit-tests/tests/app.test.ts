import request from "supertest";
import app from "../src/app";
import db from "../src/db";

const ERROR_MESSAGES = {
    NAME: {
        REQUIRED: "Name is required",
        TYPE: "Name should be a string",
        EMPTY: "Name should not be empty"
    },
    AGE: {
        REQUIRED: "Age is required",
        TYPE: "Age should be a number",
        MIN: "Age should be a positive number"
    }
};

const USER_NOT_FOUND_MESSAGE = "User not found";

describe("User API Tests", () => {
    const defaultName = "Bob";
    const defaultAge = 30;

    beforeEach(() => {
        db.users = [];
    });

    describe("Add User API Tests", () => {
        test("Should add a user", async () => {
            const res = await createTestUser({ name: defaultName, age: defaultAge });
            verifySuccessResponse(res, 201, defaultName, defaultAge);
            verifyInDatabase(res.body.id, defaultName, defaultAge);
        });

        test.each([
            [{ age: defaultAge }, [ERROR_MESSAGES.NAME.REQUIRED]],
            [{ name: "", age: defaultAge }, [ERROR_MESSAGES.NAME.EMPTY]],
            [{ name: 1, age: defaultAge }, [ERROR_MESSAGES.NAME.TYPE]],
            [{ name: defaultName }, [ERROR_MESSAGES.AGE.REQUIRED]],
            [{ name: defaultName, age: -1 }, [ERROR_MESSAGES.AGE.MIN]],
            [{ name: defaultName, age: "30" }, [ERROR_MESSAGES.AGE.TYPE]],
            [{ name: "", age: -1 }, [ERROR_MESSAGES.NAME.EMPTY, ERROR_MESSAGES.AGE.MIN]],
            [{ name: "", age: "30" }, [ERROR_MESSAGES.NAME.EMPTY, ERROR_MESSAGES.AGE.TYPE]],
            [{ name: "" }, [ERROR_MESSAGES.NAME.EMPTY, ERROR_MESSAGES.AGE.REQUIRED]],
            [{ name: 1, age: -1 }, [ERROR_MESSAGES.NAME.TYPE, ERROR_MESSAGES.AGE.MIN]],
            [{ name: 1, age: "30" }, [ERROR_MESSAGES.NAME.TYPE, ERROR_MESSAGES.AGE.TYPE]],
            [{ name: 1 }, [ERROR_MESSAGES.NAME.TYPE, ERROR_MESSAGES.AGE.REQUIRED]],
            [{ age: -1 }, [ERROR_MESSAGES.NAME.REQUIRED, ERROR_MESSAGES.AGE.MIN]],
            [{ age: "30" }, [ERROR_MESSAGES.NAME.REQUIRED, ERROR_MESSAGES.AGE.TYPE]],
            [{}, [ERROR_MESSAGES.NAME.REQUIRED, ERROR_MESSAGES.AGE.REQUIRED]],
        ])("Should return 400 when creating user with %s", async (input, expectedErrors) => {
            const res = await createTestUser(input);
            verifyErrorResponse(res, 400, expectedErrors);
        });

    });

    describe("Update User API Tests", () => {
        let id;

        beforeEach(async () => {
            const createUserRes = await createTestUser({ name: defaultName, age: defaultAge })
            id = createUserRes.body.id;
        });

        test.each([
            [{ }, defaultName, defaultAge],
            [{ name: "Bill" }, "Bill", defaultAge],
            [{ age: 35 }, defaultName, 35],
            [{ name: "John", age: 44 }, "John", 44],
        ])("Should update user with %j", async (updateData, expectedName, expectedAge) => {
            const res = await updateTestUser(id, updateData);
            verifySuccessResponse(res, 200, expectedName, expectedAge);
            verifyInDatabase(id, expectedName, expectedAge);
        });

        test.each([
            [{ name: "" }, [ERROR_MESSAGES.NAME.EMPTY]],
            [{ name: 1 }, [ERROR_MESSAGES.NAME.TYPE]],
            [{ age: "30" }, [ERROR_MESSAGES.AGE.TYPE]],
            [{ age: -1 }, [ERROR_MESSAGES.AGE.MIN]],
            [{ name: "", age: "30" }, [ERROR_MESSAGES.NAME.EMPTY, ERROR_MESSAGES.AGE.TYPE]],
            [{ name: "", age: -1 }, [ERROR_MESSAGES.NAME.EMPTY, ERROR_MESSAGES.AGE.MIN]],
            [{ name: 1, age: "30" }, [ERROR_MESSAGES.NAME.TYPE, ERROR_MESSAGES.AGE.TYPE]],
            [{ name: 1, age: -1 }, [ERROR_MESSAGES.NAME.TYPE, ERROR_MESSAGES.AGE.MIN]]
        ])("Should return 400 when updating user with %s", async (input, expectedErrors) => {
            const res = await updateTestUser(id, input);
            verifyErrorResponse(res, 400, expectedErrors);
        });

        test("Should return 404 when user not found", async () => {
            const res = await updateTestUser(-1, {});
            verifyErrorResponse(res, 404, [USER_NOT_FOUND_MESSAGE]);
        });
    });

    describe("Delete User API Tests", () => {
        test("Should delete a user", async () => {
            const createUserRes = await createTestUser({ name: defaultName, age: defaultAge });
            const id = createUserRes.body.id;
            const res = await deleteTestUser(id);
            expect(res.status).toBe(204);
            expect(res.body).toEqual({});
            const userInDb = db.users.find(user => user.id === id);
            expect(userInDb).toBeUndefined();
        });

        test("Should return 404 when user not found", async () => {
            const res = await deleteTestUser("-1");
            verifyErrorResponse(res, 404, [USER_NOT_FOUND_MESSAGE]);
        });
    });

    describe("Get User API Tests", () => {
        let userId;

        beforeEach(async () => {
            const createUserRes = await createTestUser({ name: defaultName, age: defaultAge });
            userId = createUserRes.body.id;
        });

        test("Should get a user by ID", async () => {
            const res = await getUserById(userId);
            verifySuccessResponse(res, 200, defaultName, defaultAge);
        });

        test("Should return 404 when user not found", async () => {
            const res = await getUserById("-1");
            verifyErrorResponse(res, 404, [USER_NOT_FOUND_MESSAGE]);
        });
    });

    describe("Get Users API Tests", () => {
        beforeEach(async () => {
            await createTestUser({ name: "Bob", age: 30 });
            await createTestUser({ name: "Alice", age: 25 });
            await createTestUser({ name: "Bob", age: 35 });
        });

        test("Should get all users", async () => {
            const res = await getUsers();
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(3);
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: "Bob", age: 30 }),
                    expect.objectContaining({ name: "Alice", age: 25 }),
                    expect.objectContaining({ name: "Bob", age: 35 }),
                ])
            );
        });

        test("Should filter users by name", async () => {
            const res = await getUsers({ name: "Bob" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: "Bob", age: 30 }),
                    expect.objectContaining({ name: "Bob", age: 35 }),
                ])
            );
        });

        test("Should filter users by age", async () => {
            const res = await getUsers({ age: 30 });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual([
                expect.objectContaining({ name: "Bob", age: 30 }),
            ]);
        });
    });


    const createTestUser = async (data) => {
        return await request(app).post("/api/users").send(data);
    };

    const updateTestUser = async (userId, updateData) => {
        return await request(app)
            .patch(`/api/users/${userId}`)
            .send(updateData);
    }

    const deleteTestUser = async (userId) => {
        return await request(app).delete(`/api/users/${userId}`);
    };

    const getUserById = async (id) => {
        return await request(app).get(`/api/users/${id}`);
    };

    const getUsers = async (queryParams = {}) => {
        return await request(app).get(`/api/users`).query(queryParams);
    };

    const verifySuccessResponse = (res, expectedStatus, expectedName, expectedAge) => {
        expect(res.status).toBe(expectedStatus);

        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));

        expect(Object.keys(res.body)).toEqual(['id', 'name', 'age']);
        expect(res.body.name).toBe(expectedName);
        expect(res.body.age).toBe(expectedAge);
        expect(res.body).toHaveProperty("id");
        expect(res.body.id).not.toBeNull();
    };

    const verifyInDatabase = (id, expectedName, expectedAge) => {
        const userInDb = db.users.find(user => user.id === id);
        expect(userInDb).toBeDefined();
        expect(userInDb.name).toBe(expectedName);
        expect(userInDb.age).toBe(expectedAge);
    };

    const verifyErrorResponse = (res, status, expectedErrors) => {
        expect(res.status).toBe(status);

        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));

        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors).toHaveLength(expectedErrors.length);

        expect(res.body.errors).toStrictEqual(expectedErrors);
    };
});