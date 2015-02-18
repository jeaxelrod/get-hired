FactoryGirl.define do
  factory :job do
    sequence(:position) { |n| "Position #{n}" }
    sequence(:company)  { |n| "Company #{n}"  }
    sequence(:link)     { |n| "http://link#{n}.com" }

    user
  end
end
