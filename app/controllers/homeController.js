const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function homeController() {
  //GENERATE THE TOKEN SNIPPET.
  const tokenGenerate = async (userLogin) => {
    let token = jwt.sign(
      {
        uuid: userLogin.uuid,
        name: userLogin.name,
      },
      'SECRET_KEY',
      { expiresIn: '30d' },
    );
    userLogin.token = token;
    await userLogin.save();

    return { token };
  };
  return {
    //GET_ALL_USERS.
    async index(req, res) {
      try {
        await User.findAll()
          .then((results) => {
            return res.status(200).json({
              success: true,
              results,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        console.log(e);
      }
    },
    //REGISTER THE USERS.
    async register(req, res) {
      try {
        const {
          firstname,
          lastname,
          address,
          gender,
          email,
          phone,
          password,
          cpassword,
        } = req.body;
        let hashedPasswords = await bcrypt.hash(password, 12);
        let hashedConfirmPasswords = await bcrypt.hash(cpassword, 12);
        User.findOne({
          where: { phone: req.body.phone },
        }).then((results) => {
          if (results) {
            return res.status(400).json({
              message: 'Phone Is Allready Registered.',
              success: false,
            });
          } else {
            User.create({
              firstname,
              lastname,
              address,
              gender,
              email,
              phone,
              password: hashedPasswords,
              cpassword: hashedConfirmPasswords,
            })
              .then((users) => {
                return res.status(200).json({
                  message: 'User Registered Successfully',
                  success: true,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    //GET BY ID
    async getUserById(req, res) {
      try {
        const uuid = req.params.uuid;
        const user = await User.findOne({ where: { uuid } });
        return res.status(200).json(user);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something Went Wront' });
      }
    },
    //DELETE BY ID
    async deleteUserByid(req, res) {
      const uuid = req.params.uuid;
      try {
        const user = await User.findOne({ where: { uuid } });
        await user.destroy();
        return res
          .status(200)
          .json({ message: 'User is Deleted Successfully' });
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: 'Something Went Wrong', success: false });
      }
    },

    //UPDATE BY ID.
    async updateUserByid(req, res) {
      const uuid = req.params.uuid;
      console.log('updateUserBy', uuid);
      try {
        let user = await User.findOne({ where: { uuid } });
        if (!user) {
          return res.status(400).json({ message: 'User is not found' });
        }
        user = await User.update(req.body, { where: { uuid } });
        return res.status(200).json({
          message: 'User Updated Successfully',
          status: 'success',
        });
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: 'Something Went Wrong', success: false });
      }
    },
    //SIGNIN
    async signIn(req, res) {
      try {
        const { phone, password } = req.body;
        if (!phone || !password) {
          return res.status(400).json({
            error: 'Please !!! Enter Your Email And Password',
            success: false,
          });
        }
        const userLogin = await User.findOne({ where: { phone } });
        if (!userLogin) {
          return res
            .status(404)
            .json({ error: 'Invalid Credentials', success: false });
        }
        if (userLogin) {
          const isMatch = await bcrypt.compare(password, userLogin.password);
          let token = await tokenGenerate(userLogin);
          res.cookie('jwt', token, {
            expires: new Date(Date.now() + 2592000000),
            httpOnly: true,
          });
          if (!isMatch) {
            res
              .status(400)
              .json({ message: 'Invalid login Credentials', success: false });
          } else {
            res.json({
              message: 'Login Successfully Done',
              success: true,
              phone,
              tokens: [token],
            });
          }
        } else {
          res
            .status(400)
            .json({ message: 'Invalid login Credentials', success: false });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async test(req, res) {
      await res.json(req.user);
    },
  };
}

module.exports = homeController;
