num_letters = 5
random_text = ""

for index in range(num_letters):
    # String.from_char_code is the exact command MakeCode looks for
    random_text = random_text + String.from_char_code(randint(65, 90))

basic.show_string(random_text)
