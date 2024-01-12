require 'json'

package = JSON.parse(File.read(File.join('..', 'package.json')))

Pod::Spec.new do |s|
  s.name      = 'NetInfo-UITests'
  s.version   = package['version']
  s.author    = { package['author']['name'] => package['author']['email'] }
  s.license   = package['license']
  s.homepage  = package['homepage']
  s.source    = { :git => package['repository']['url'] }
  s.summary   = 'NetInfo tests'

  s.ios.deployment_target = '13.0'
  s.osx.deployment_target = '10.15'

  s.dependency 'React'

  s.framework             = 'XCTest'
  s.user_target_xcconfig  = { 'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' => '$(inherited)' }

  s.osx.source_files = 'macos/NetInfoExample-macOSUITests/**/*.{m,swift}'
end
