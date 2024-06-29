// Import the functions to be tested
const { getHistory, getUser, deposit } = require('../service/userService');
const db = require('../db');

jest.mock('../db', () => ({
    query: jest.fn(),
}));

describe('Function Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getHistory', () => {
        it('should fetch user balance history in reverse order', async () => {
            const mockUserId = 1;
            const mockRows = [{ id: 1, user_id: mockUserId, amount: 100 }];
            db.query.mockResolvedValueOnce({ rows: mockRows });

            const result = await getHistory(mockUserId);

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM "balance_history" WHERE user_id = $1', [mockUserId]);
            expect(result).toEqual(mockRows.reverse());
        });
    });

    describe('getUser', () => {
        it('should fetch user details by userId', async () => {
            const mockUserId = 1;
            const mockUser = { id: mockUserId, username: 'testuser' };
            db.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await getUser(mockUserId);

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE id = $1', [mockUserId]);
            expect(result).toEqual(mockUser);
        });
    });

    describe('deposit', () => {
        it('should deposit amount and update balance for verified user with valid promo', async () => {
            const mockUserId = 1;
            const mockBalance = 100;
            const mockPromo = 'VALID_PROMO';
            const mockPromoAmount = 50;
            const mockPromoRow = { amount: mockPromoAmount };
            const mockUserRow = { id: mockUserId, isverified: true };

            db.query
                .mockResolvedValueOnce({ rows: [mockPromoRow] })
                .mockResolvedValueOnce({ rows: [mockUserRow] });

            const result = await deposit(mockUserId, mockBalance, mockPromo);

            expect(db.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM "promos" WHERE promo = $1', [mockPromo]);
            expect(db.query).toHaveBeenNthCalledWith(2, 'SELECT * FROM "User" WHERE id = $1', [mockUserId]);
            expect(db.query).toHaveBeenNthCalledWith(3, 'UPDATE "User" SET balance = $1 WHERE id = $2', [mockBalance + mockPromoAmount, mockUserId]);
            expect(db.query).toHaveBeenNthCalledWith(4, 'INSERT INTO "balance_history" (user_id, amount, description, operation_type) values ($1, $2, $3, $4) RETURNING *', [mockUserId, mockPromoAmount, "промокод", "credit"]);

            expect(result).toEqual(mockBalance + mockPromoAmount);
        });

        it('should return error for unverified user', async () => {
            const mockUserId = 1;
            const mockBalance = 100;
            const mockPromo = 'VALID_PROMO';
            const mockUserRow = { id: mockUserId, isverified: false };

            db.query
                .mockResolvedValueOnce({ rows: [{ amount: 50 }] })
                .mockResolvedValueOnce({ rows: [mockUserRow] });

            const result = await deposit(mockUserId, mockBalance, mockPromo);

            expect(result).toEqual({
                error: true,
                message: "Необходимо пройти верификацию!"
            });
        });

        it('should return error for invalid promo code', async () => {
            const mockUserId = 1;
            const mockBalance = 100;
            const mockPromo = 'INVALID_PROMO';

            db.query.mockResolvedValueOnce({ rows: [] });

            const result = await deposit(mockUserId, mockBalance, mockPromo);

            expect(result).toEqual({
                error: true,
                message: "Неверный промокод!"
            });
        });
    });
});
