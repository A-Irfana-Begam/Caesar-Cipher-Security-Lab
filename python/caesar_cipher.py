def caesar_cipher(text, shift):
    result = ""

    for char in text:

        if char.isupper():
            result += chr((ord(char) - ord('A') + shift) % 26 + ord('A'))

        elif char.islower():
            result += chr((ord(char) - ord('a') + shift) % 26 + ord('a'))

        else:
            result += char

    return result


print("================================")
print("   CAESAR CIPHER SECURITY LAB")
print("================================")

message = input("Enter message: ")
shift = int(input("Enter shift value: "))

encrypted = caesar_cipher(message, shift)
decrypted = caesar_cipher(encrypted, -shift)

print("\nEncrypted Message :", encrypted)
print("Decrypted Message :", decrypted)