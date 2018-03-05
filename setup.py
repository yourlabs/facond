import os

from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name='facond',
    version='0.3.1',
    description='Reactive forms with actions and conditions',
    author='James Pic',
    author_email='jpic@yourlabs.org',
    url='http://facond.rtfd.org',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    include_package_data=True,
    zip_safe=False,
    long_description=read('README'),
    keywords='django dynamic form',
    entry_points = {
        'console_scripts': [
            'facond = facond_examples.manage:main',
        ],
    },
    extras_require=dict(
        django=['django>=2.0'],
        demo=['django>=2.0', 'django-material>=1.2.2'],
    ),
    classifiers=[
        'Development Status :: 1 - Planning',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 3',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ]
)
