FactoryGirl.define do
  factory :user do
    first_name "John"
    last_name "Doe"
    email  { "#{first_name}.#{last_name}@gmail.com" }
    password   "password"
    password_confirmation "password"
  end

end
