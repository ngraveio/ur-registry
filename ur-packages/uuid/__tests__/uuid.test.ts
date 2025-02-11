import { UUID } from '../src/index';

describe('UUID', () => {
  it('should generate a valid UUID', () => {
    const uuid = UUID.generate();
    expect(uuid.toString()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it('should create a UUID from a string', () => {
    const uuidString = '123e4567-e89b-12d3-a456-426614174000';
    const uuid = new UUID(uuidString);
    expect(uuid.toString()).toBe(uuidString);
  });

  it('should create a UUID from bytes', () => {
    const uuidBytes = new Uint8Array([18, 62, 69, 103, 232, 155, 18, 211, 164, 86, 66, 102, 20, 23, 64, 0]);
    const uuid = new UUID(uuidBytes);
    expect(uuid.toString()).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should verify a valid UUID string', () => {
    const uuidString = '123e4567-e89b-12d3-a456-426614174000';
    const uuid = new UUID(uuidString);
    const verification = uuid.verifyInput(uuidString);
    expect(verification.valid).toBe(true);
  });

  it('should verify a valid UUID bytes', () => {
    const uuidBytes = new Uint8Array([18, 62, 69, 103, 232, 155, 18, 211, 164, 86, 66, 102, 20, 23, 64, 0]);
    const uuid = new UUID(uuidBytes);
    const verification = uuid.verifyInput(uuidBytes);
    expect(verification.valid).toBe(true);
  });

  it('should return an error for invalid UUID string', () => {
    const invalidUuidString = 'invalid-uuid-string';
    const uuid = new UUID('123e4567-e89b-12d3-a456-426614174000');
    const verification = uuid.verifyInput(invalidUuidString);
    expect(verification.valid).toBe(false);
    expect(verification.reasons).toBeDefined();
  });

  it('should return an error for invalid UUID bytes', () => {
    const invalidUuidBytes = new Uint8Array([1, 2, 3]);
    const uuid = new UUID('123e4567-e89b-12d3-a456-426614174000');
    const verification = uuid.verifyInput(invalidUuidBytes);
    expect(verification.valid).toBe(false);
    expect(verification.reasons).toBeDefined();
  });
});
