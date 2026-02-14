require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

is_new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
  s.name         = "react-native-netinfo"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "14.0", :tvos => "14.0", :osx => "14.0", :visionos => "1.0" }

  s.source       = { :git => "https://github.com/react-native-community/react-native-netinfo.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  s.frameworks = 'NetworkExtension'


  if is_new_arch_enabled
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end
end
