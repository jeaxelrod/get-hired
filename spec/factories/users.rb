FactoryGirl.define do
  factory :user do
    sequence(:first_name) { |n|  "John#{n}" }
    sequence(:last_name) { |n|  "Doe#{n}" }
    email  { "#{first_name}.#{last_name}@gmail.com" }
    password   "password"
    password_confirmation "password"
  end

end
